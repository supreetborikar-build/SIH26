import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, Scan, Box, Layers, Crosshair } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface StageInfo {
  id: number;
  stageCode: string;
  name: string;
  sub: string;
  desc: string;
  math: string;
  stats: { label: string; val: string }[];
}

const STAGES: StageInfo[] = [
  {
    id: 1,
    stageCode: '01 / CAPTURE',
    name: 'RAW AERIAL CAPTURE',
    sub: '4K Monocular Flight Ingestion',
    desc: 'Uncalibrated monocular drone video stream ingested alongside asynchronous flight timestamps and GPS/barometer telemetry.',
    math: 'I(x,y,t) \\in \\mathbb{R}^{H \\times W \\times 3} \\quad \\& \\quad \\mathbf{p}_{\\text{gps}}(t) \\in \\mathbb{R}^3',
    stats: [
      { label: 'RESOLUTION', val: '3840 x 2160' },
      { label: 'ENCODING', val: '120 Mbps H.265' },
      { label: 'RATE', val: '60.0 FPS' }
    ]
  },
  {
    id: 2,
    stageCode: '02 / EXTRACT',
    name: 'ADAPTIVE EXTRACTION',
    sub: 'Laplacian Blur & Saliency Filtering',
    desc: 'Calculates spatial Laplacian variance across consecutive frames. Automatically drops motion-blurred frames and redundant stationary baselines.',
    math: '\\text{Score}(I_k) = \\sigma^2(\\nabla^2 I_k) \\cdot \\exp\\left(-\\frac{\\Vert \\mathbf{v}_{\\text{opt}} \\Vert^2}{2\\sigma_v^2}\\right)',
    stats: [
      { label: 'RETENTION', val: '384 / 3,600' },
      { label: 'BLUR THRESHOLD', val: 'σ² > 142.0' },
      { label: 'FILTER RATE', val: '82.4% CULLED' }
    ]
  },
  {
    id: 3,
    stageCode: '03 / UNDERSTAND',
    name: 'FEATURE CORRESPONDENCE',
    sub: 'Scale-Space Extrema & Epipolar Match',
    desc: 'Extracts tens of thousands of scale-invariant keypoints across structural contours. Verified using RANSAC guided epipolar geometry.',
    math: '\\mathbf{x}_2^T \\mathbf{F} \\mathbf{x}_1 = 0 \\implies \\mathbf{x}_2^T \\mathbf{K}^{-T} [\\mathbf{t}]_{\\times} \\mathbf{R} \\mathbf{K}^{-1} \\mathbf{x}_1 = 0',
    stats: [
      { label: 'KEYPOINTS/FRAME', val: '3,850 PTS' },
      { label: 'INLIER RATIO', val: '82.5%' },
      { label: 'REPROJECTION', val: '0.42 PX' }
    ]
  },
  {
    id: 4,
    stageCode: '04 / ESTIMATE',
    name: 'CAMERA POSE & TRAJECTORY',
    sub: 'Structure from Motion (SfM) Triangulation',
    desc: 'Recovers full 6-DoF camera poses along the flight curve and triangulates sparse 3D tie points in Euclidean space via global bundle adjustment.',
    math: '\\arg\\min_{\\mathbf{R}_i, \\mathbf{t}_i, \\mathbf{X}_j} \\sum_{i,j} \\Vert \\mathbf{x}_{ij} - \\pi(\\mathbf{K}[\\mathbf{R}_i \\mid \\mathbf{t}_i]\\mathbf{X}_j) \\Vert^2',
    stats: [
      { label: 'POSES SOLVED', val: '384 FRUSTUMS' },
      { label: 'SPARSE POINTS', val: '94,200 PTS' },
      { label: 'SCALE', val: 'METRIC VIA GNSS' }
    ]
  },
  {
    id: 5,
    stageCode: '05 / RECONSTRUCT',
    name: 'DENSE MULTI-VIEW STEREO',
    sub: 'PatchMatch Photometric Depth Propagation',
    desc: 'Aggregates photometric cost volumes across overlapping baseline views to calculate per-pixel depth and normal vectors for millions of points.',
    math: '\\mathcal{C}(\\mathbf{p}, d) = 1 - \\text{NCC}\\left( \\mathcal{W}_1(\\mathbf{p}), \\mathcal{W}_2(\\pi_2(\\mathbf{P}(d))) \\right)',
    stats: [
      { label: 'DENSE POINTS', val: '1,284,000 PTS' },
      { label: 'DENSITY', val: '210 PTS / M²' },
      { label: 'CONFIDENCE', val: '98.8%' }
    ]
  },
  {
    id: 6,
    stageCode: '06 / BUILD',
    name: 'WATERTIGHT MESH & TEXTURE',
    sub: 'Screened Poisson Surface & UV Atlas',
    desc: 'Solves spatial Poisson equation to generate continuous watertight triangle surfaces. Blends high-resolution UV radiance textures.',
    math: '\\Delta \\chi = \\nabla \\cdot \\vec{V} \\quad \\& \\quad \\mathbf{X}_{\\text{UTM}} = s \\mathbf{R} \\mathbf{X}_{\\text{local}} + \\mathbf{T}',
    stats: [
      { label: 'TRIANGLES', val: '412,500 FACETS' },
      { label: 'TEXTURE ATLAS', val: '8K PBR DIFFUSE' },
      { label: 'DATUM', val: 'WGS 84 / UTM 43N' }
    ]
  },
  {
    id: 7,
    stageCode: '07 / ANALYZE',
    name: 'SPATIAL INTELLIGENCE & METRICS',
    sub: 'Metrology, AI Segmentation & Anomaly Layer',
    desc: 'The reconstructed world becomes directly measurable: point-to-point 3D distance, elevation changes, volumetric cut/fill, and semantic AI masks.',
    math: 'd = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2} \\quad \\& \\quad \\mathcal{M}_{\\text{AI}} = \\text{SegFormer}(\\mathcal{M}_{\\text{3D}})',
    stats: [
      { label: 'ACCURACY', val: '±2.4 CM / 100M' },
      { label: 'MEASUREMENTS', val: 'CALIPER READY' },
      { label: 'AI LAYERS', val: '4 ACTIVE CLASSES' }
    ]
  }
];

export const HeroTransformation: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev % STAGES.length) + 1);
    }, 4800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStage = STAGES[currentStage - 1];

  return (
    <section id="transformation" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-white">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>PIPELINE DECOMPOSITION // 07 CORE PHASES</span>
              <StatusBadge status="IMPLEMENTED" size="sm" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              From Aerial Motion <br />
              <span className="text-slate-400">To Spatial Intelligence</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            The mathematical transformation from 2D optical projection into an intelligent 3D digital world.
            Progress through the 7 sequential computational states.
          </div>
        </div>

        {/* Stage Navigation Stepper (7 Phases) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {STAGES.map((stg) => {
            const isActive = stg.id === currentStage;
            const isPassed = stg.id < currentStage;

            return (
              <button
                key={stg.id}
                onClick={() => {
                  setCurrentStage(stg.id);
                  setIsPlaying(false);
                }}
                className={`relative text-left p-3 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-lg'
                    : isPassed
                    ? 'bg-[#06080C] border-white/20 text-slate-300 hover:border-white/40'
                    : 'bg-[#030508] border-white/10 text-slate-500 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-[9px]">
                  <span className={isActive ? 'text-black font-bold' : 'text-slate-400'}>
                    0{stg.id}
                  </span>
                  <span className={isActive ? 'text-black font-bold' : 'text-slate-500'}>
                    PHASE
                  </span>
                </div>
                <div className={`text-[11px] font-mono font-bold uppercase truncate ${isActive ? 'text-black' : 'text-white'}`}>
                  {stg.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Canvas Display Frame */}
        <div className="relative border border-white/15 bg-[#05070B] overflow-hidden hud-bracket-container">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          {/* Top HUD Frame Bar */}
          <div className="bg-black/90 px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Scan className="w-3.5 h-3.5" />
                <span>PHASE: {activeStage.stageCode}</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="text-slate-400 uppercase text-[11px]">{activeStage.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 text-[10px] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-emerald-400" />}
                <span>{isPlaying ? 'PAUSE' : 'AUTO CYCLE'}</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setCurrentStage((prev) => (prev === 1 ? STAGES.length : prev - 1));
                    setIsPlaying(false);
                  }}
                  className="p-1 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
                  aria-label="Previous Phase"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentStage((prev) => (prev % STAGES.length) + 1);
                    setIsPlaying(false);
                  }}
                  className="p-1 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
                  aria-label="Next Phase"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Visualization Canvas Area */}
          <div className="relative h-[380px] sm:h-[460px] w-full bg-black overflow-hidden flex items-center justify-center select-none">
            {/* STAGE 01: RAW CAPTURE */}
            {currentStage === 1 && (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80"
                  alt="Raw Aerial Drone Capture"
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none" />

                {/* Drone Camera Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border border-white/30 rounded-full flex items-center justify-center relative">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <div className="absolute top-0 w-px h-6 bg-white" />
                    <div className="absolute bottom-0 w-px h-6 bg-white" />
                    <div className="absolute left-0 h-px w-6 bg-white" />
                    <div className="absolute right-0 h-px w-6 bg-white" />
                  </div>
                </div>

                <div className="absolute top-6 left-6 font-mono text-[10px] text-white space-y-1 bg-black/80 p-3 border border-white/20">
                  <div className="font-bold text-white uppercase">[INPUT.01] RAW SENSOR STREAM</div>
                  <div>GIMBAL: -45.0° PITCH | SPEED: 8.6 M/S</div>
                  <div>GPS: 28.6139°N, 77.2090°E | ALT: 120.4M AGL</div>
                </div>
              </div>
            )}

            {/* STAGE 02: ADAPTIVE FRAME SELECTION */}
            {currentStage === 2 && (
              <div className="relative w-full h-full bg-black flex items-center justify-center p-6">
                <div className="grid grid-cols-3 gap-3 w-full max-w-3xl h-full">
                  {[
                    { frame: 'F_0142', score: '94.2', status: 'SELECTED (STABLE)', color: 'border-white bg-white/5 text-white' },
                    { frame: 'F_0143', score: '38.1', status: 'CULLED (MOTION BLUR)', color: 'border-white/10 bg-black text-slate-600 opacity-40' },
                    { frame: 'F_0144', score: '42.6', status: 'CULLED (REDUNDANT)', color: 'border-white/10 bg-black text-slate-600 opacity-40' },
                    { frame: 'F_0145', score: '91.8', status: 'SELECTED (SHARP)', color: 'border-white bg-white/5 text-white' },
                    { frame: 'F_0146', score: '93.5', status: 'SELECTED (HIGH SALIENCY)', color: 'border-white bg-white/5 text-white' },
                    { frame: 'F_0147', score: '29.0', status: 'CULLED (EXPOSURE FLARE)', color: 'border-white/10 bg-black text-slate-600 opacity-40' },
                  ].map((f, idx) => (
                    <div key={idx} className={`p-3 border flex flex-col justify-between ${f.color}`}>
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="font-bold">{f.frame}</span>
                        <span className="text-slate-400">Q={f.score}</span>
                      </div>
                      <div className="my-2 h-16 bg-[#080B10] border border-white/10 flex items-center justify-center font-mono text-[9px] text-slate-500">
                        LAPLACIAN VARIANCE MAP
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-wider">
                        {f.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 03: FEATURE DETECTION & CORRESPONDENCE */}
            {currentStage === 3 && (
              <div className="relative w-full h-full bg-black flex flex-col items-center justify-center p-6">
                <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 380">
                  <rect x="50" y="40" width="300" height="260" fill="#06090E" stroke="#262F40" strokeWidth="1.5" />
                  <text x="65" y="70" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">FRAME A (T=0.0S)</text>

                  <rect x="450" y="40" width="300" height="260" fill="#06090E" stroke="#262F40" strokeWidth="1.5" />
                  <text x="465" y="70" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">FRAME B (T=+0.5S)</text>

                  {[
                    { x1: 120, y1: 130, x2: 500, y2: 125 },
                    { x1: 180, y1: 100, x2: 560, y2: 98 },
                    { x1: 220, y1: 210, x2: 610, y2: 205 },
                    { x1: 140, y1: 250, x2: 520, y2: 248 },
                    { x1: 280, y1: 170, x2: 670, y2: 165 },
                    { x1: 300, y1: 260, x2: 700, y2: 258 },
                    { x1: 160, y1: 170, x2: 540, y2: 166 },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x1} cy={pt.y1} r="3.5" fill="#FFFFFF" />
                      <circle cx={pt.x2} cy={pt.y2} r="3.5" fill="#FFFFFF" />
                      <line x1={pt.x1} y1={pt.y1} x2={pt.x2} y2={pt.y2} stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.8" />
                    </g>
                  ))}
                </svg>
                <div className="font-mono text-xs text-white bg-black px-4 py-1 border border-white/20">
                  EPIPOLAR GEOMETRY VERIFIED: 2,450 VALID INLIER CORRESPONDENCES
                </div>
              </div>
            )}

            {/* STAGE 04: CAMERA POSES & TRAJECTORY */}
            {currentStage === 4 && (
              <div className="relative w-full h-full bg-black flex flex-col items-center justify-center p-6">
                <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 380">
                  {/* Trajectory Flight Path */}
                  <path d="M 80,90 C 250,40 550,140 720,90" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 3" />

                  {/* Frustums */}
                  {[
                    { x: 120, y: 82, angle: 30 },
                    { x: 260, y: 62, angle: 20 },
                    { x: 420, y: 100, angle: 0 },
                    { x: 570, y: 120, angle: -20 },
                    { x: 690, y: 95, angle: -35 },
                  ].map((c, i) => (
                    <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${c.angle})`}>
                      <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                      <polygon points="0,0 -20,50 20,50" fill="rgba(255, 255, 255, 0.1)" stroke="#FFFFFF" strokeWidth="1" />
                    </g>
                  ))}

                  {/* Sparse Tie Points */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <circle key={i} cx={150 + (i * 37) % 520} cy={230 + (i * 19) % 110} r="2" fill="#FFFFFF" opacity="0.8" />
                  ))}
                </svg>
                <div className="font-mono text-xs text-white bg-black px-4 py-1 border border-white/20">
                  BUNDLE ADJUSTMENT CONVERGED | REPROJECTION ERROR: 0.68 PX
                </div>
              </div>
            )}

            {/* STAGE 05: DENSE MULTI-VIEW STEREO */}
            {currentStage === 5 && (
              <div className="relative w-full h-full bg-black flex flex-col items-center justify-center p-6">
                <div className="relative w-full max-w-2xl h-64 border border-white/20 overflow-hidden bg-[#06080C] flex items-center justify-center">
                  <div className="absolute inset-0 dither-pattern opacity-40" />
                  <div className="relative z-10 w-4/5 h-4/5 flex flex-wrap items-center justify-center gap-1.5 p-4">
                    {Array.from({ length: 240 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: i % 4 === 0 ? '#FFFFFF' : i % 3 === 0 ? '#CBD5E1' : '#64748B',
                          opacity: Math.random() * 0.7 + 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scanline pointer-events-none" />
                </div>
                <div className="mt-4 font-mono text-xs text-white bg-black px-4 py-1 border border-white/20">
                  MULTI-VIEW STEREO: 1,284,000 DENSE 3D SURFACE COORDINATES
                </div>
              </div>
            )}

            {/* STAGE 06: WATERTIGHT MESH & TEXTURE */}
            {currentStage === 6 && (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1600&q=80"
                  alt="3D Textured Mesh"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 aerospace-grid-bg opacity-30 pointer-events-none" />

                <div className="absolute top-8 left-1/3 bg-black/90 border border-white px-3 py-1.5 font-mono text-xs text-white">
                  SCREENED POISSON SURFACE: WATERTIGHT MESH (WGS-84 / UTM 43N)
                </div>
              </div>
            )}

            {/* STAGE 07: SPATIAL INTELLIGENCE & METRICS */}
            {currentStage === 7 && (
              <div className="relative w-full h-full bg-black flex flex-col items-center justify-center p-6">
                <div className="relative w-full max-w-2xl h-72 border border-white/30 bg-[#06080E] p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center font-mono text-xs border-b border-white/10 pb-2 text-white">
                    <span className="font-bold">[METROLOGY ENGINE] POINT A &rarr; POINT B</span>
                    <span className="text-emerald-400">CALIBRATED UTM 43N</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs my-auto">
                    <div className="bg-black p-2.5 border border-white/10">
                      <div className="text-[9px] text-slate-500">EUCLIDEAN DIST</div>
                      <div className="text-base font-bold text-white">42.84 M</div>
                    </div>
                    <div className="bg-black p-2.5 border border-white/10">
                      <div className="text-[9px] text-slate-500">ELEVATION DELTA</div>
                      <div className="text-base font-bold text-white">+14.20 M</div>
                    </div>
                    <div className="bg-black p-2.5 border border-white/10">
                      <div className="text-[9px] text-slate-500">SLOPE ANGLE</div>
                      <div className="text-base font-bold text-white">18.4°</div>
                    </div>
                    <div className="bg-black p-2.5 border border-white/10">
                      <div className="text-[9px] text-slate-500">CONFIDENCE</div>
                      <div className="text-base font-bold text-emerald-400">98.6%</div>
                    </div>
                  </div>

                  <div className="text-center font-mono text-xs text-slate-400 pt-2 border-t border-white/10">
                    AI INTELLIGENCE READY: SEMANTIC SEGMENTATION &bull; ANOMALY DETECTION &bull; CHANGE MAPPING
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stage Details Drawer */}
          <div className="bg-[#040609] p-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="text-[10px] font-mono text-slate-500 mb-1">{activeStage.stageCode} // SPECIFICATION</div>
              <h3 className="text-base font-display font-bold text-white uppercase">{activeStage.sub}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">{activeStage.desc}</p>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-slate-500 mb-1">MATHEMATICAL RIGOR</div>
              <div className="bg-black border border-white/10 p-3 font-mono text-xs text-white overflow-x-auto">
                {activeStage.math}
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 gap-1.5">
              {activeStage.stats.map((st, idx) => (
                <div key={idx} className="bg-black border border-white/10 px-3 py-1.5 flex justify-between items-center font-mono text-xs">
                  <span className="text-[10px] text-slate-500">{st.label}</span>
                  <span className="text-white font-bold">{st.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
