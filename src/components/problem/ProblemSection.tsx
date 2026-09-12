import React, { useState } from 'react';
import { AlertTriangle, MapPin, EyeOff, Cpu, CheckCircle2, XCircle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'challenges'>('comparison');
  const [sliderPos, setSliderPos] = useState(50);

  const challenges = [
    {
      id: 'gps-drift',
      title: 'GNSS DRIFT & MULTIPATH DISTORTION',
      desc: 'Consumer drone GPS drifts ±3 to 8 meters in urban canyon or vertical relief topography due to atmospheric delays and multi-path satellite reflection.',
      solution: 'Tightly-coupled Extended Kalman Filter (EKF) combining visual odometry with barometric pressure and dual-frequency satellite tracking.',
      impact: 'Reduces positioning uncertainty from ±5.2m to < 0.8m without ground surveyor targets.'
    },
    {
      id: 'perspective',
      title: 'PERSPECTIVE FORESHORTENING & SCALE LOSS',
      desc: 'Monocular cameras collapse 3D reality into 2D perspective. Scale varies inversely with distance from lens center, making direct metric measurement impossible.',
      solution: 'Structure-from-Motion triangulates relative baseline scale by fusing physical camera sensor displacement with visual disparity.',
      impact: 'Eliminates optical foreshortening; establishes true orthogonal metric scale.'
    },
    {
      id: 'occlusion',
      title: 'SINGLE-PASS OCCLUSIONS & BLIND FACETS',
      desc: 'In a single-pass trajectory, surfaces facing opposite the camera flight vector are partially occluded, causing geometric holes in naive depth maps.',
      solution: 'Wide-baseline multi-view stereopsis and Screened Poisson surface continuity with geometric confidence covariance mapping.',
      impact: 'Watertight surface mesh with explicit geometric confidence labels.'
    },
    {
      id: 'compute',
      title: 'COMPUTATIONAL THROUGHPUT BOTTLENECKS',
      desc: 'Standard desktop photogrammetry requires 4–12 hours of offline batch processing for 4K video, making real-time tactical reconnaissance unviable.',
      solution: 'Adaptive Laplacian keyframe selection (culling 82% redundancy) coupled with GPU-parallelized PatchMatch depth estimation.',
      impact: 'Produces initial actionable 3D sparse geometry in minutes.'
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
            <span className="w-1.5 h-1.5 bg-white" />
            <span>OPERATIONAL CONSTRAINT // NTRO PROBLEM CONTEXT</span>
            <StatusBadge status="IMPLEMENTED" size="sm" />
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            A Video Is <br className="hidden sm:inline" />
            <span className="text-slate-400">Not A Map.</span>
          </h2>

          <p className="text-slate-400 max-w-2xl text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Raw aerial footage provides only uncalibrated 2D pixels subject to perspective foreshortening,
            GPS drift, and zero geometric metric scale. Here is why turning flight into spatial truth requires
            rigorous computer vision.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mb-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 border transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white text-black font-bold border-white'
                : 'bg-black text-slate-400 border-white/15 hover:text-white'
            }`}
          >
            INTERACTIVE COMPARISON // 2D VIDEO VS 3D TWIN
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 border transition-all cursor-pointer ${
              activeTab === 'challenges'
                ? 'bg-white text-black font-bold border-white'
                : 'bg-black text-slate-400 border-white/15 hover:text-white'
            }`}
          >
            TECHNICAL BOTTLENECK ANALYSIS (4 DOSSIERS)
          </button>
        </div>

        {/* INTERACTIVE COMPARISON TAB */}
        {activeTab === 'comparison' && (
          <div className="border border-white/20 bg-[#05070B] overflow-hidden hud-bracket-container">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />

            <div className="relative h-[460px] sm:h-[500px] w-full select-none overflow-hidden bg-black">
              {/* Left Side: Raw Video Layer */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1800&q=80"
                  alt="Raw Video Perspective"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Annotation Box */}
                <div className="absolute top-6 left-6 font-mono text-[10px] bg-black/90 p-3 border border-white/20 text-white max-w-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <XCircle className="w-3.5 h-3.5" />
                    RAW MONOCULAR VIDEO
                  </div>
                  <div className="text-slate-400">• Optical perspective distortion</div>
                  <div className="text-slate-400">• GPS drift uncertainty (±4.8m)</div>
                  <div className="text-slate-400">• Cannot measure distances directly</div>
                </div>
              </div>

              {/* Right Side: Reconstructed 3D World Layer */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1800&q=80"
                  alt="3D Digital Twin"
                  className="w-full h-full object-cover filter grayscale contrast-150 brightness-90"
                />
                <div className="absolute inset-0 aerospace-grid-bg opacity-30 pointer-events-none" />

                {/* Annotation Box */}
                <div className="absolute top-6 right-6 font-mono text-[10px] bg-black/90 p-3 border border-white text-white max-w-xs space-y-1 text-right">
                  <div className="font-bold flex items-center justify-end gap-1.5 text-white">
                    <span>GEOREFERENCED 3D TWIN</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-slate-300">• Orthogonal metric datum (UTM 43N)</div>
                  <div className="text-slate-300">• Sub-centimeter GSD ground resolution</div>
                  <div className="text-slate-300">• Direct point-to-point measurement</div>
                </div>
              </div>

              {/* Interactive Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white cursor-ew-resize z-20 shadow-[0_0_10px_#FFFFFF]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white text-black flex items-center justify-center font-mono text-xs font-bold">
                  ↔
                </div>
              </div>

              {/* Drag Input Overlay */}
              <input
                type="range"
                min="5"
                max="95"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Compare 2D Video vs 3D Digital Twin"
              />
            </div>

            <div className="bg-black px-6 py-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span>DRAG SLIDER HORIZONTALLY TO REVEAL RECONSTRUCTED GEOMETRY</span>
              <span className="text-white">SLIDER POSITION: {sliderPos}%</span>
            </div>
          </div>
        )}

        {/* TECHNICAL CHALLENGES TAB */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            {challenges.map((ch, idx) => (
              <div
                key={ch.id}
                className="bg-[#05070B] border border-white/15 p-6 hover:border-white/40 transition-all hud-bracket-container"
              >
                <div className="hud-bracket-tl" />
                <div className="hud-bracket-tr" />
                <div className="hud-bracket-bl" />
                <div className="hud-bracket-br" />

                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <span className="text-slate-500 text-[10px]">BOTTLENECK 0{idx + 1}</span>
                  <span className="text-white text-[10px] uppercase font-bold">CRITICAL SIH FACTOR</span>
                </div>

                <h3 className="font-display font-bold text-white text-sm uppercase mb-2">
                  {ch.title}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                  {ch.desc}
                </p>

                <div className="bg-black p-3 border border-white/10 space-y-1 text-xs">
                  <div className="text-white font-bold text-[10px]">ENGINEERING SOLUTION:</div>
                  <div className="text-slate-300 text-[11px] font-sans">{ch.solution}</div>
                  <div className="text-white text-[10px] pt-1 border-t border-white/10">
                    &bull; METRIC IMPACT: {ch.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
