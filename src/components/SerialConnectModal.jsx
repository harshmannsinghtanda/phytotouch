import React, { useState, useEffect, useRef } from 'react';
import { X, Usb, CheckCircle2, AlertCircle, RefreshCw, Terminal, Play, Square, Cpu } from 'lucide-react';
import { audioEngine } from '../audio/PlantAudioEngine';

export function SerialConnectModal({ isOpen, onClose, onConnected }) {
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState('DISCONNECTED'); // 'DISCONNECTED' | 'CONNECTED' | 'SIMULATING'
  const [errorMsg, setErrorMsg] = useState('');
  const [baudRate, setBaudRate] = useState(115200);
  const [terminalLogs, setTerminalLogs] = useState([
    '[INIT] WebSerial UART Driver v4.2 Ready',
    '[INFO] Select physical ESP32 COM port or activate Virtual Bio-Simulator.'
  ]);
  const [simPacketCount, setSimPacketCount] = useState(0);
  const simIntervalRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Handle Virtual ESP32 Hardware Simulation
  const toggleSimulator = () => {
    if (status === 'SIMULATING') {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      setStatus('DISCONNECTED');
      setTerminalLogs((prev) => [...prev.slice(-30), '[SIM] Virtual ESP32 stream stopped.']);
    } else {
      audioEngine.unlock();
      setStatus('SIMULATING');
      setTerminalLogs((prev) => [
        ...prev.slice(-30),
        '[SIM] Virtual ESP32-WROOM-32 booting up...',
        '[SIM] ADC Calibration: 12-bit (0-4095), 11dB attenuation',
        '[SIM] 50 Hz Live Bio-Potential Telemetry Streaming Started'
      ]);

      let count = 0;
      simIntervalRef.current = setInterval(() => {
        count++;
        setSimPacketCount(count);
        const nodeIdx = Math.floor(Math.random() * 8);
        const rawMv = (0.6 + Math.random() * 1.8).toFixed(2);
        const flux = (20 + Math.random() * 40).toFixed(1);
        const touchRaw = Math.floor(180 + Math.random() * 80);

        const packet = `$BIO:N${nodeIdx + 1}:CH${nodeIdx}=${touchRaw},V=${rawMv}mV,FLUX=+${flux}uS*${Math.floor(Math.random() * 90 + 10).toString(16).toUpperCase()}`;

        // Occasionally trigger a gentle tone
        if (count % 12 === 0) {
          audioEngine.triggerLeaf(nodeIdx % 7, 0.45);
        }

        setTerminalLogs((prev) => [...prev.slice(-25), packet]);
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setErrorMsg('');
    if (!('serial' in navigator)) {
      setErrorMsg('Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera — or click "Start Virtual ESP32 Stream" below.');
      return;
    }

    try {
      setConnecting(true);
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: Number(baudRate) });
      setStatus('CONNECTED');
      setConnecting(false);
      setTerminalLogs((prev) => [
        ...prev,
        `[HARDWARE] Physical COM port opened successfully at ${baudRate} baud.`,
        '[HARDWARE] Listening for ESP32 raw capacitive packets...'
      ]);
      if (onConnected) onConnected(port);
    } catch (err) {
      setConnecting(false);
      setErrorMsg(err.message || 'Failed to establish physical serial connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#171d1a] border border-[#47f3bb]/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col font-['Inter'] text-[#dde4de]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#3b4a43]/40 flex items-center justify-between bg-[#1b211e]">
          <div className="flex items-center gap-2">
            <Usb className="w-5 h-5 text-[#47f3bb]" />
            <h3 className="font-['Syne'] text-base font-bold text-[#dde4de]">ESP32 Hardware &amp; WebSerial Bridge</h3>
          </div>
          <button
            onClick={() => {
              if (simIntervalRef.current) clearInterval(simIntervalRef.current);
              onClose();
            }}
            className="p-1 rounded-lg text-[#bacac1] hover:text-white hover:bg-[#252b28] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          <p className="text-[#bacac1] leading-relaxed">
            Connect an ESP32 or Arduino board running the PhytoTouch firmware over USB, or test the live streaming telemetry right now using the built-in virtual simulator.
          </p>

          {/* Connection Mode & Baud Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] uppercase font-bold">
                Baud Rate:
              </label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="bg-[#09100c] border border-[#3b4a43]/40 rounded-xl px-3 py-2 text-[#dde4de] font-['JetBrains_Mono'] text-xs focus:outline-none focus:border-[#47f3bb]"
              >
                <option value="115200">115,200 Baud (Standard)</option>
                <option value="9600">9,600 Baud</option>
                <option value="57600">57,600 Baud</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] uppercase font-bold">
                Current Status:
              </label>
              <div className="p-2 rounded-xl bg-[#09100c] border border-[#3b4a43]/40 flex items-center gap-2 font-['JetBrains_Mono'] h-[38px]">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === 'CONNECTED'
                      ? 'bg-[#47f3bb] shadow-[0_0_8px_#47f3bb]'
                      : status === 'SIMULATING'
                      ? 'bg-[#f0c04d] animate-pulse shadow-[0_0_8px_#f0c04d]'
                      : 'bg-[#ffb4ab]'
                  }`}
                />
                <span
                  className={`font-bold text-[11px] ${
                    status === 'CONNECTED'
                      ? 'text-[#47f3bb]'
                      : status === 'SIMULATING'
                      ? 'text-[#f0c04d]'
                      : 'text-[#ffb4ab]'
                  }`}
                >
                  {status}
                </span>
                {status === 'SIMULATING' && (
                  <span className="text-[9px] text-[#bacac1] ml-auto">#{simPacketCount}</span>
                )}
              </div>
            </div>
          </div>

          {/* Live WebSerial ASCII Terminal */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] uppercase font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#47f3bb]" />
                Live 115200 Baud Stream Monitor
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] bg-[#47f3bb]/10 px-2 py-0.5 rounded">
                RX / TX ACTIVE
              </span>
            </div>
            <div className="bg-[#09100c] border border-[#3b4a43]/40 rounded-xl p-3 h-36 overflow-y-auto font-['JetBrains_Mono'] text-[10px] text-[#47f3bb] flex flex-col gap-1 shadow-inner select-text">
              {terminalLogs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-tight ${
                    log.startsWith('$BIO')
                      ? 'text-[#64f1b4]'
                      : log.startsWith('[SIM]')
                      ? 'text-[#f0c04d]'
                      : log.startsWith('[HARDWARE]')
                      ? 'text-[#47f3bb] font-bold'
                      : 'text-[#bacac1]'
                  }`}
                >
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#ba1a1a]/20 border border-[#ba1a1a]/40 text-[#ffdad6] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            {/* Physical WebSerial Request Button */}
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] font-['JetBrains_Mono'] text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,214,160,0.3)] cursor-pointer flex items-center justify-center gap-2"
            >
              {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Usb className="w-4 h-4" />}
              <span>{connecting ? 'Connecting...' : 'Connect Physical USB'}</span>
            </button>

            {/* Virtual ESP32 Hardware Simulator Button */}
            <button
              onClick={toggleSimulator}
              className={`w-full sm:flex-1 py-2.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                status === 'SIMULATING'
                  ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-[0_0_12px_rgba(255,180,171,0.4)]'
                  : 'bg-[#1b211e] hover:bg-[#252b28] text-[#f0c04d] border-[#f0c04d]/40'
              }`}
            >
              {status === 'SIMULATING' ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{status === 'SIMULATING' ? 'Stop Simulator' : 'Test Virtual Rig (No USB)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
