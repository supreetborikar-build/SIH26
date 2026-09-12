import React from 'react';
import { ArrowRight, Compass, Shield, Layers, Scan, Crosshair, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryState } from '../../types/aerial';

interface HeroSectionProps {
  telemetry: TelemetryState;
  onExploreClick: () => void;
  onLaunchViewer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  telemetry,
  onExploreClick,
  onLaunchViewer,
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black select-none">
      {/* Background Dither / Halftone Overlay */}
      <div className="absolute inset-0 dither-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 aerospace-grid-bg opacity-30 pointer-events-none" />

      {/* Main Perimeter HUD Bounding Box */}
      <div className="max-w-7xl mx-auto w-full relative z-10 border border-white/15 bg-[#030508]/80 p-6 sm:p-10 lg:p-12 hud-bracket-container">
        {/* Four Technical Corner Brackets */}
        <div className="hud-bracket-tl" />
        <div className="hud-bracket-tr" />
        <div className="hud-bracket-bl" />
        <div className="hud-bracket-br" />

        {/* Top Perimeter Metadata Ribbon */}
        <div className="border-b border-white/10 pb-4 mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold tracking-wider">[SYS.01 // RECONSTRUCTION.PROTOCOL]</span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MISSION: ACTIVE
            </span>
            <span className="text-white/20">|</span>
            <span>SOURCE: UAV VIDEO (1080P/4K)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300">FRAME STREAM: LIVE</span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300">GPS: AVAILABLE</span>
            <span className="text-white/20">|</span>
            <StatusBadge status="IMPLEMENTED" size="sm" />
          </div>
        </div>

        {/* Split Cinematic Hero Content: Left Visual Imagery / Right Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: Cinematic Aerial Imagery / HUD Reticle Frame */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative h-[320px] sm:h-[420px] w-full border border-white/20 bg-[#070A0F] overflow-hidden hud-bracket-container">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />

              {/* Monochrome Treated Aerial Capture */}
              <img
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80"
                alt="Monocular Aerial Capture"
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-75"
              />

              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scanline pointer-events-none" />

              {/* Center Targeting Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-36 h-36 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute top-0 w-px h-4 bg-white/70" />
                  <div className="absolute bottom-0 w-px h-4 bg-white/70" />
                  <div className="absolute left-0 h-px w-4 bg-white/70" />
                  <div className="absolute right-0 h-px w-4 bg-white/70" />
                  <div className="absolute -top-5 font-mono text-[9px] text-white/80 tracking-wider">
                    TARGET: 28.6139°N
                  </div>
                </div>
              </div>

              {/* Left Vertical Altimeter Gauge */}
              <div className="absolute top-4 left-4 bg-black/80 border border-white/15 px-2.5 py-1.5 font-mono text-[9px] text-white space-y-0.5">
                <div className="text-slate-500">ALTITUDE AGL</div>
                <div className="text-xs font-bold">{telemetry.altitudeAgl.toFixed(1)} M</div>
                <div className="text-slate-500 pt-1 border-t border-white/10">FOV: 84° NADIR</div>
              </div>

              {/* Right Bottom Processing State */}
              <div className="absolute bottom-4 right-4 bg-black/85 border border-white/15 px-3 py-1.5 font-mono text-[9px] text-white space-y-0.5 text-right">
                <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  RECONSTRUCTION: READY
                </div>
                <div className="text-slate-400">GEOMETRY: PROCESSING</div>
              </div>
            </div>

            {/* Sub-label */}
            <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 mt-2">
              <span>RAW SENSOR FEED // UNSTABILIZED MONOCULAR</span>
              <span>COMPRESSION: H.265 / 60 FPS</span>
            </div>
          </div>

          {/* RIGHT: High-Impact Editorial Typography & Project Statement */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <div className="font-mono text-[11px] text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-white" />
                <span>SINGLE-PASS AERIAL INTELLIGENCE</span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-7xl font-display font-extrabold text-white tracking-tighter uppercase leading-[0.92]">
                ONE FLIGHT. <br />
                <span className="text-slate-300">AN ENTIRE WORLD.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 font-sans font-normal leading-relaxed max-w-xl">
              A single drone flight transformed into an intelligent, measurable, georeferenced 3D digital world.
              Structure-from-Motion geometry recovery, multi-sensor telemetry fusion, and spatial intelligence
              without ground survey dependencies.
            </p>

            {/* Tactical CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchViewer}
                className="px-6 py-3.5 bg-white hover:bg-slate-200 text-black font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Compass className="w-4 h-4 text-black" />
                <span>ENTER 3D DIGITAL TWIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-black hover:bg-white/10 border border-white/30 text-white font-mono text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-300" />
                <span>VIEW SfM PIPELINE</span>
              </button>
            </div>

            {/* Quick Context Callout */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-slate-400 font-mono text-[10px]">
              <Shield className="w-3.5 h-3.5 text-white" />
              <span>SPONSORED BY NTRO // ROBOTICS &amp; DRONES THEME // PROBLEM STATEMENT SIH26158</span>
            </div>
          </div>
        </div>

        {/* Bottom Technical Status Matrix */}
        <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="border-l border-white/20 pl-3">
            <div className="text-[9px] text-slate-500 uppercase">GROUND RESOLUTION</div>
            <div className="text-sm font-bold text-white mt-0.5">1.85 CM / PX</div>
            <div className="text-[8px] text-slate-400">SUB-CENTIMETER GSD</div>
          </div>

          <div className="border-l border-white/20 pl-3">
            <div className="text-[9px] text-slate-500 uppercase">BUNDLE RESIDUAL</div>
            <div className="text-sm font-bold text-white mt-0.5">0.68 PX</div>
            <div className="text-[8px] text-slate-400">LEVENBERG-MARQUARDT</div>
          </div>

          <div className="border-l border-white/20 pl-3">
            <div className="text-[9px] text-slate-500 uppercase">GEOID DATUM</div>
            <div className="text-sm font-bold text-white mt-0.5">WGS 84 / UTM 43N</div>
            <div className="text-[8px] text-slate-400">METRIC CONVERSION</div>
          </div>

          <div className="border-l border-white/20 pl-3">
            <div className="text-[9px] text-slate-500 uppercase">SENSOR FUSION</div>
            <div className="text-sm font-bold text-white mt-0.5">15-STATE EKF</div>
            <div className="text-[8px] text-emerald-400 font-semibold">TIGHTLY COUPLED</div>
          </div>
        </div>
      </div>
    </section>
  );
};
