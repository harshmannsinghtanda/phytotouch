/* ==============================================================================
   CitrusSerialService.js
   Web Serial API Interface for ESP32 / Arduino Optical Citrus Sorter Hardware
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

export class CitrusSerialService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.onStatusChange = null;
    this.onDataReceived = null;
    this.keepReading = false;
  }

  isSupported() {
    return 'serial' in navigator;
  }

  async connect(baudRate = 115200) {
    if (!this.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Use Chrome, Edge, or Opera.');
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate });

      this.isConnected = true;
      this.keepReading = true;

      const encoder = new TextEncoderStream();
      encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();

      if (this.onStatusChange) {
        this.onStatusChange(true, 'CONNECTED to ESP32 Sorter Controller (115200 baud)');
      }

      this.startReadingLoop();
      return true;
    } catch (err) {
      this.isConnected = false;
      if (this.onStatusChange) {
        this.onStatusChange(false, `Connection failed: ${err.message}`);
      }
      throw err;
    }
  }

  async startReadingLoop() {
    while (this.port && this.port.readable && this.keepReading) {
      try {
        const textDecoder = new TextDecoderStream();
        this.port.readable.pipeTo(textDecoder.writable);
        this.reader = textDecoder.readable.getReader();

        let buffer = '';
        while (this.keepReading) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value) {
            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep incomplete chunk

            for (const line of lines) {
              const clean = line.trim();
              if (!clean) continue;
              if (this.onDataReceived) {
                try {
                  const parsed = JSON.parse(clean);
                  this.onDataReceived(parsed, clean);
                } catch {
                  this.onDataReceived({ raw: clean }, clean);
                }
              }
            }
          }
        }
      } catch {
        break;
      }
    }
  }

  async sendCommand(cmdString) {
    if (!this.isConnected || !this.writer) {
      return false;
    }
    try {
      await this.writer.write(cmdString.endsWith('\n') ? cmdString : cmdString + '\n');
      return true;
    } catch (err) {
      console.error('Serial TX Error:', err);
      return false;
    }
  }

  async sendSortGrade(grade) {
    return this.sendCommand(`SORT:${grade}`);
  }

  async testServo(angle) {
    return this.sendCommand(`TEST:${angle}`);
  }

  async ping() {
    return this.sendCommand('PING');
  }

  async resetHardwareCounts() {
    return this.sendCommand('RESET_COUNTS');
  }

  async disconnect() {
    this.keepReading = false;
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
    } catch {
      // Ignore cleanup error
    } finally {
      this.isConnected = false;
      if (this.onStatusChange) {
        this.onStatusChange(false, 'DISCONNECTED from hardware');
      }
    }
  }
}

export const citrusSerialService = new CitrusSerialService();
