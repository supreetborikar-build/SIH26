import React, { useState } from 'react';
import { Compass, Radio, Activity, Crosshair, ArrowRight, ShieldCheck } from 'lucide-react';
import { TelemetryState } from '../../types/aerial';
import { StatusBadge } from '../common/StatusBadge';

interface SensorFusionConsoleProps {
  telemetry: TelemetryState;
}

export const SensorFusionConsole: React.FC<SensorFusionConsoleProps> = ({ telemetry }) => {
  const [selectedSensor, setSelectedSensor] = useState<string>('gnss');

  const sensors = [
    {
      id: 'gnss',
      title: 'GNSS / RTK SATELLITE',
      val: `${telemetry.latitude.toFixed(5)}°N, ${telemetry.longitude.toFixed(5)}°E`,
      status: telemetry.rtkStatus,
      rate: '10 HZ',
      icon: Radio,
      desc: 'Provides earth-centered geodetic position anchors. Carrier phase tracking resolves integer ambiguities for sub-meter scale estimation.'
    },
    {
      id: 'imu',
      title: '3-AXIS IMU GYROSCOPE',
      val: `R:${telemetry.roll}° P:${telemetry.pitch}° Y:${telemetry.yaw}°`,
      status: 'CALIBRATED',
      rate: '200 HZ',
      icon: Compass,
      desc: 'High-rate MEMS accelerometer and rate gyroscope. Measures angular velocity and specific force between visual keyframes.'
    },
    {
      id: 'baro',
      title: 'BAROMETRIC ALTIMETER',
      val: `${telemetry.altitudeMsl.toFixed(1)}M MSL (${telemetry.altitudeAgl.toFixed(1)}M AGL)`,
      status: 'ACTIVE',
      rate: '50 HZ',
      icon: Activity,
      desc: 'Measures ambient hydrostatic pressure gradients to decouple vertical altitude drift from visual baseline pitch ambiguity.'
    },
    {
      id: 'camera',
      title: 'OPTICAL INTRINSICS MATRIX K',
      val: 'F=24MM | 1/1250S | ISO 100',
      status: 'RECTIFIED',
      rate: '60 FPS',
      icon: Crosshair,
      desc: 'Pinhole camera parameters with Brown-Conrady radial and tangential distortion correction preventing spherical warping.'
    }
  ];

  return (
    <section id="sensor-fusion" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>SENSOR.FUSION // TELEMETRY CONVERGENCE</span>
              <StatusBadge status="IMPLEMENTED" size="sm" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              Tightly-Coupled <br />
              <span className="text-slate-400">Sensor Fusion & Scale</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            VIDEO + GPS + IMU + ALTITUDE + CAMERA INTRINSICS &rarr; 15-STATE EKF &rarr; CAMERA POSE + SCALE + GEOREFERENCE.
            Anchoring local photogrammetric geometry into global UTM coordinates.
          </div>
        </div>

        {/* Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 4 Ingested Sensor Signal Feeds */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="font-mono text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>HETEROGENEOUS INPUTS</span>
              <span className="text-white font-bold text-[10px]">ALL STREAMS SYNCED</span>
            </div>

            {sensors.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedSensor === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensor(s.id)}
                  className={`p-3.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border-white'
                      : 'bg-[#05070A] border-white/15 hover:border-white/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-white'}`} />
                      <span className="font-mono text-xs font-bold uppercase">{s.title}</span>
                    </div>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 border ${
                      isSelected ? 'border-black text-black' : 'border-white/20 text-slate-400'
                    }`}>
                      {s.rate}
                    </span>
                  </div>

                  <div className={`font-mono text-xs font-bold mb-1 truncate ${isSelected ? 'text-black' : 'text-slate-200'}`}>
                    {s.val}
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className={isSelected ? 'text-black font-semibold' : 'text-slate-500'}>
                      STATUS: {s.status}
                    </span>
                    <span className={isSelected ? 'text-black font-bold' : 'text-slate-400'}>
                      INSPECT &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Column: Live Primary Flight Display (PFD) Artificial Horizon */}
          <div className="lg:col-span-5 bg-[#05070A] border border-white/20 p-6 flex flex-col justify-between hud-bracket-container">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="font-mono text-xs text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">PRIMARY FLIGHT DISPLAY (PFD)</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                FRAME #{telemetry.frameIndex}
              </div>
            </div>

            {/* Simulated Pitch & Roll Horizon */}
            <div className="relative h-56 bg-black border border-white/15 overflow-hidden flex items-center justify-center select-none">
              <div
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{
                  transform: `rotate(${telemetry.roll}deg) translateY(${telemetry.pitch * 3}px)`
                }}
              >
                <div className="h-1/2 bg-[#0B0F17] border-b border-white/70" />
                <div className="h-1/2 bg-black" />
              </div>

              {/* Pitch Ladder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono text-[9px] text-white/70">
                <div className="w-14 border-t border-dashed border-white/50 my-2 text-center">+10°</div>
                <div className="w-20 border-t border-white my-2 text-center font-bold">00° HORIZON</div>
                <div className="w-14 border-t border-dashed border-white/50 my-2 text-center">-10°</div>
              </div>

              {/* Center Aircraft Symbol */}
              <div className="relative z-10 w-20 h-6 flex items-center justify-between pointer-events-none">
                <div className="w-6 h-0.5 bg-white" />
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <div className="w-6 h-0.5 bg-white" />
              </div>

              {/* Tapes */}
              <div className="absolute top-2 left-2 bg-black border border-white/20 px-2 py-0.5 font-mono text-[9px] text-white">
                SPD: {telemetry.speedMps.toFixed(1)} M/S
              </div>
              <div className="absolute top-2 right-2 bg-black border border-white/20 px-2 py-0.5 font-mono text-[9px] text-white">
                ALT: {telemetry.altitudeAgl.toFixed(0)} M
              </div>
              <div className="absolute bottom-2 left-2 bg-black border border-white/20 px-2 py-0.5 font-mono text-[9px] text-slate-300">
                HDG: {telemetry.yaw.toFixed(0)}°
              </div>
            </div>

            {/* EKF Formulation Card */}
            <div className="mt-4 bg-black border border-white/10 p-3 font-mono text-xs">
              <div className="text-[9px] text-slate-500 mb-1 flex justify-between">
                <span>EXTENDED KALMAN FILTER (15-STATE)</span>
                <span className="text-emerald-400 font-bold">CONVERGED</span>
              </div>
              <div className="text-white text-[10px] overflow-x-auto">
                x = [p_x, p_y, p_z, v_x, v_y, v_z, q_0..q_3, b_a, b_g]^T
              </div>
            </div>
          </div>

          {/* Right Column: Georeferencing & Spatial Datum Projection */}
          <div className="lg:col-span-3 bg-[#05070A] border border-white/20 p-5 flex flex-col justify-between hud-bracket-container">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />

            <div>
              <div className="font-mono text-xs text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="font-bold">SPATIAL DATUM</span>
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase mb-3">
                WGS-84 &rarr; UTM ZONE 43N
              </h3>

              <div className="space-y-2 font-mono text-xs">
                <div className="bg-black p-2.5 border border-white/10">
                  <div className="text-[9px] text-slate-500">UTM EASTING</div>
                  <div className="text-sm font-bold text-white">715,482.4 M E</div>
                </div>

                <div className="bg-black p-2.5 border border-white/10">
                  <div className="text-[9px] text-slate-500">UTM NORTHING</div>
                  <div className="text-sm font-bold text-white">3,167,820.1 M N</div>
                </div>

                <div className="bg-black p-2.5 border border-white/10">
                  <div className="text-[9px] text-slate-500">GEOID SEPARATION (EGM96)</div>
                  <div className="text-sm font-bold text-white">-42.8 M</div>
                </div>

                <div className="bg-black p-2.5 border border-white/10">
                  <div className="text-[9px] text-slate-500">METRIC SCALE ACCURACY</div>
                  <div className="text-sm font-bold text-emerald-400">&lt; 0.024% (±2.4CM/100M)</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-slate-500">
              Rigid 7-parameter similarity transform aligns photogrammetric point coordinates with national spatial infrastructure.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
