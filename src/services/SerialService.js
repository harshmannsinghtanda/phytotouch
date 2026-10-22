/**
 * SerialService: Web Serial API Bridge for ESP32 / Arduino
 * Connects directly from the browser to the microcontroller over USB
 * Native in Chrome/Edge, zero drivers or external software needed!
 */

class SerialService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.readableStreamClosed = null;
    this.isConnected = false;
    this.baudRate = 115200;
    this.callbacks = {
      onData: null,
      onConnect: null,
      onDisconnect: null,
      onError: null
    };

    // Auto-calibration baseline per channel (leaves 0 to 4)
    this.baselines = [70, 70, 70, 70, 70];
    this.thresholdRatio = 0.65; // Trigger when value drops below 65% of baseline
    this.lastTriggerTime = [0, 0, 0, 0, 0];
    this.cooldownMs = 120; // Debounce
  }

  isSupported() {
    return 'serial' in navigator;
  }

  setCallbacks({ onData, onConnect, onDisconnect, onError }) {
    this.callbacks = { onData, onConnect, onDisconnect, onError };
  }

  async connect() {
    if (!this.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: this.baudRate });
      this.isConnected = true;

      const encoder = new TextEncoderStream();
      encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();

      if (this.callbacks.onConnect) {
        const info = this.port.getInfo();
        this.callbacks.onConnect(info);
      }

      this.readLoop();
      return true;
    } catch (err) {
      this.isConnected = false;
      if (this.callbacks.onError) this.callbacks.onError(err);
      throw err;
    }
  }

  async readLoop() {
    const textDecoder = new TextDecoderStream();
    this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.getReader();

    let buffer = '';

    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep incomplete line

          for (const line of lines) {
            this.processLine(line.trim());
          }
        }
      }
    } catch (err) {
      console.warn('Serial read error:', err);
    } finally {
      this.disconnect();
    }
  }

  processLine(line) {
    if (!line) return;

    // Supports CSV format: "35,72,68,14,55" or "L0:32,L1:65..."
    const values = line.split(',').map(s => {
      const match = s.match(/-?\d+(\.\d+)?/);
      return match ? parseFloat(match[0]) : null;
    }).filter(v => v !== null);

    if (values.length > 0) {
      const touches = this.evaluateTouches(values);
      if (this.callbacks.onData) {
        this.callbacks.onData({
          raw: line,
          values,
          touches,
          timestamp: Date.now()
        });
      }
    }
  }

  evaluateTouches(rawValues) {
    const now = Date.now();
    const touchDeltas = [];

    rawValues.slice(0, 5).forEach((val, idx) => {
      // Dynamic baseline adaptation when untouched
      if (val > this.baselines[idx] * 0.85) {
        this.baselines[idx] = this.baselines[idx] * 0.98 + val * 0.02;
      }

      const threshold = this.baselines[idx] * this.thresholdRatio;
      const isTouched = val < threshold;
      const delta = Math.max(0, this.baselines[idx] - val);
      const intensity = Math.min(1.0, delta / (this.baselines[idx] * 0.6 || 1));

      let triggered = false;
      if (isTouched && (now - this.lastTriggerTime[idx] > this.cooldownMs)) {
        this.lastTriggerTime[idx] = now;
        triggered = true;
      }

      touchDeltas.push({
        leafIndex: idx,
        rawValue: val,
        baseline: Math.round(this.baselines[idx]),
        isTouched,
        triggered,
        intensity: parseFloat(intensity.toFixed(2))
      });
    });

    return touchDeltas;
  }

  async sendCommand(cmd) {
    if (!this.writer) return;
    try {
      await this.writer.write(cmd + '\n');
    } catch (err) {
      console.warn('Serial transmit error:', err);
    }
  }

  async calibrate(customBaselines) {
    if (customBaselines && customBaselines.length) {
      this.baselines = [...customBaselines];
    }
    if (this.isConnected) {
      await this.sendCommand('C');
    }
  }

  async disconnect() {
    this.isConnected = false;
    try {
      if (this.writer) {
        await this.writer.close().catch(() => {});
        this.writer = null;
      }
      if (this.reader) {
        await this.reader.cancel().catch(() => {});
        await this.readableStreamClosed?.catch(() => {});
        this.reader = null;
      }
      if (this.port) {
        await this.port.close().catch(() => {});
        this.port = null;
      }
    } catch (e) {
      console.warn('Error during disconnect:', e);
    }
    if (this.callbacks.onDisconnect) {
      this.callbacks.onDisconnect();
    }
  }
}

export const serialService = new SerialService();
