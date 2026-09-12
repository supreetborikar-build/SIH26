import React, { useState } from 'react';
import { Camera, Play, RefreshCw, Cpu, Layers } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const SfmVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(3);
  const [filterOutliers, setFilterOutliers] = useState<boolean>(true);

  const steps = [
    { num: 1, label: '01 / KEYFRAMES', desc: 'Monocular baseline views' },
    { num: 2, label: '02 / SIFT DETECT', desc: 'Scale-space keypoints' },
    { num: 3, label: '03 / CORRESPONDENCE', desc: 'Cross-view epipolar match' },
    { num: 4, label: '04 / BUNDLE SOLVER', desc: 'Pose [R|t] & Essential matrix' },
    { num: 5, label: '05 / 3D TIE POINTS', desc: 'Triangulated geometry' },
  ];

  const frames = [
    { id: 'FRAME 01', timestamp: '00:04.2S', pitch: '-12°', x: 20 },
    { id: 'FRAME 02', timestamp: '00:04.8S', pitch: '-11°', x: 260 },
    { id: 'FRAME 03', timestamp: '00:05.4S', pitch: '-13°', x: 500 },
    { id: 'FRAME 04', timestamp: '00:06.0S', pitch: '-10°', x: 740 },
  ];

  return (
    <section id="sfm-pipeline" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>VISION.SYSTEM // MULTI-VIEW GEOMETRY</span>
              <StatusBadge status="IMPLEMENTED" size="sm" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              Structure From Motion <br />
              <span className="text-slate-400">Geometry Recovery</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Recovering full 3D spatial geometry from multiple 2D observations.
            Feature detection, correspondence matching, and camera pose triangulation.
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 font-mono text-xs">
          {steps.map((st) => {
            const isActive = st.num === activeStep;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`p-3 border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black border-white'
                    : 'bg-[#05070B] border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                <div className="font-bold mb-1">{st.label}</div>
                <div className={`text-[10px] truncate ${isActive ? 'text-black' : 'text-slate-500'}`}>{st.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Visualizer Workbench */}
        <div className="border border-white/20 bg-[#05070B] overflow-hidden hud-bracket-container">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          {/* Top Frame Control Strip */}
          <div className="bg-black/90 px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3 text-slate-300">
              <Camera className="w-4 h-4 text-white" />
              <span className="text-white font-bold">4-FRAME BASELINE SEQUENCE</span>
              <span className="text-white/20">|</span>
              <span className="text-slate-400 text-[11px]">ACTIVE PHASE: STEP 0{activeStep}</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={filterOutliers}
                  onChange={(e) => setFilterOutliers(e.target.checked)}
                  className="rounded border-white/30 bg-black text-white focus:ring-0"
                />
                <span>RANSAC OUTLIER CULLING</span>
              </label>

              <button
                onClick={() => setActiveStep((prev) => (prev % 5) + 1)}
                className="px-3 py-1 bg-white hover:bg-slate-200 text-black font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              >
                <Play className="w-3 h-3 text-black" />
                <span>STEP FORWARD</span>
              </button>
            </div>
          </div>

          {/* SVG Multi-View Corridor Diagram */}
          <div className="relative h-[400px] sm:h-[440px] w-full bg-black overflow-hidden flex items-center justify-center select-none p-4">
            <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 420">
              {/* Drone Flight Track Curve */}
              {activeStep >= 4 && (
                <path
                  d="M 50,70 Q 500,20 950,70"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
              )}

              {/* 4 Multi-View Frames */}
              {frames.map((fr, idx) => (
                <g key={fr.id} transform={`translate(${fr.x}, 100)`}>
                  <rect
                    x="0"
                    y="0"
                    width="220"
                    height="165"
                    fill="#080C12"
                    stroke={activeStep >= 3 ? '#FFFFFF' : '#222A38'}
                    strokeWidth="1"
                  />
                  <rect x="0" y="0" width="220" height="24" fill="#0D131D" />
                  <text x="10" y="16" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold">
                    {fr.id} // {fr.timestamp}
                  </text>
                  <text x="180" y="16" fill="#64748B" fontFamily="JetBrains Mono" fontSize="9">
                    {fr.pitch}
                  </text>

                  {/* Inner Frame View */}
                  <rect x="8" y="30" width="204" height="126" fill="#030508" />

                  {/* Structural Silhouettes */}
                  <polygon points="30,135 30,70 90,50 150,70 150,135" fill="#0F1724" stroke="#222F42" strokeWidth="1" />
                  <polygon points="120,135 120,80 180,65 195,135" fill="#0F1724" stroke="#222F42" strokeWidth="1" />

                  {/* Keypoints */}
                  {activeStep >= 2 && (
                    <g>
                      <circle cx="30" cy="70" r="3" fill="#FFFFFF" />
                      <circle cx="90" cy="50" r="3" fill="#FFFFFF" />
                      <circle cx="150" cy="70" r="3" fill="#FFFFFF" />
                      <circle cx="90" cy="100" r="3" fill="#CBD5E1" />
                      <circle cx="120" cy="80" r="3" fill="#FFFFFF" />
                      <circle cx="180" cy="65" r="3" fill="#FFFFFF" />
                      <circle cx="60" cy="120" r="2.5" fill="#94A3B8" />

                      {!filterOutliers && (
                        <circle cx="190" cy="40" r="3" fill="#EF4444" />
                      )}
                    </g>
                  )}

                  {/* Camera Pose Cone */}
                  {activeStep >= 4 && (
                    <g transform="translate(110, -35)">
                      <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                      <polygon points="0,0 -35,35 35,35" fill="rgba(255, 255, 255, 0.08)" stroke="#FFFFFF" strokeWidth="0.8" />
                      <text x="-20" y="-6" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9">
                        POSE {idx + 1}
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* Step 3: Correspondence Lines */}
              {activeStep === 3 && (
                <g>
                  <line x1="110" y1="150" x2="350" y2="150" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
                  <line x1="170" y1="170" x2="410" y2="170" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
                  <line x1="50" y1="170" x2="290" y2="170" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
                  <line x1="350" y1="150" x2="590" y2="150" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
                  <line x1="410" y1="170" x2="650" y2="170" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
                  <line x1="590" y1="150" x2="830" y2="150" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />

                  {!filterOutliers && (
                    <line x1="210" y1="140" x2="450" y2="140" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" />
                  )}
                </g>
              )}

              {/* Step 5: Triangulated 3D Geometry */}
              {activeStep >= 4 && (
                <g transform="translate(0, 310)">
                  <line x1="80" y1="80" x2="920" y2="80" stroke="#222A38" strokeWidth="1" />
                  <line x1="130" y1="-175" x2="350" y2="40" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                  <line x1="370" y1="-175" x2="350" y2="40" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                  <line x1="610" y1="-175" x2="620" y2="30" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
                  <line x1="850" y1="-175" x2="620" y2="30" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />

                  {Array.from({ length: 50 }).map((_, i) => (
                    <circle key={i} cx={200 + (i * 27) % 620} cy={20 + (i * 13) % 65} r="2" fill="#FFFFFF" />
                  ))}

                  <text x="500" y="95" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle">
                    TRIANGULATED SPATIAL TIE POINTS [X, Y, Z] (GNSS FUSED SCALE)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Parameter Matrix */}
          <div className="bg-[#040609] p-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-black p-2.5 border border-white/10">
              <div className="text-[9px] text-slate-500">CORRESPONDENCES</div>
              <div className="text-sm font-bold text-white">2,840 PAIRS</div>
              <div className="text-[9px] text-slate-400">SIFT 128-D DESCRIPTORS</div>
            </div>

            <div className="bg-black p-2.5 border border-white/10">
              <div className="text-[9px] text-slate-500">RANSAC INLIERS</div>
              <div className="text-sm font-bold text-emerald-400">82.5% VERIFIED</div>
              <div className="text-[9px] text-slate-400">RESIDUAL &lt; 0.8 PX</div>
            </div>

            <div className="bg-black p-2.5 border border-white/10">
              <div className="text-[9px] text-slate-500">ESSENTIAL MATRIX</div>
              <div className="text-sm font-bold text-white">NISTÉR 5-POINT SVD</div>
              <div className="text-[9px] text-slate-400">CHIRALITY VERIFIED</div>
            </div>

            <div className="bg-black p-2.5 border border-white/10">
              <div className="text-[9px] text-slate-500">BUNDLE ADJUSTMENT</div>
              <div className="text-sm font-bold text-white">0.68 PX RESIDUAL</div>
              <div className="text-[9px] text-slate-400">CONVERGED 14 ITER</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
