import { useState, useEffect } from 'react';
import { TelemetryState } from '../types/aerial';

export function useFlightTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    timestamp: new Date().toISOString(),
    latitude: 28.61393,
    longitude: 77.20902,
    altitudeMsl: 342.5,
    altitudeAgl: 120.4,
    speedMps: 8.6,
    roll: 1.2,
    pitch: -2.4,
    yaw: 142.8,
    satellites: 22,
    hdop: 0.74,
    rtkStatus: 'RTK FIXED',
    focalLengthMm: 24.0,
    iso: 100,
    shutterSpeed: '1/1250s',
    batteryPct: 87,
    frameIndex: 284,
    fps: 59.94
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeSec = now.getTime() / 1000;

      setTelemetry((prev) => ({
        ...prev,
        timestamp: now.toISOString(),
        latitude: 28.61393 + Math.sin(timeSec * 0.1) * 0.0008,
        longitude: 77.20902 + Math.cos(timeSec * 0.1) * 0.0008,
        altitudeMsl: 342.5 + Math.sin(timeSec * 0.3) * 1.5,
        altitudeAgl: 120.4 + Math.sin(timeSec * 0.3) * 1.5,
        speedMps: 8.5 + Math.sin(timeSec * 0.5) * 0.4,
        roll: Number((Math.sin(timeSec * 1.2) * 2.5).toFixed(1)),
        pitch: Number((-2.0 + Math.cos(timeSec * 0.8) * 1.8).toFixed(1)),
        yaw: Number((142.8 + Math.sin(timeSec * 0.05) * 15).toFixed(1)),
        frameIndex: (prev.frameIndex + 1) % 1800,
        batteryPct: Math.max(12, 87 - Math.floor(timeSec / 120) % 20)
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return telemetry;
}
