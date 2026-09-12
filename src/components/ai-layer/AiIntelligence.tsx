import React, { useState } from 'react';
import { Cpu, AlertTriangle, Layers, Split, CheckCircle2, ShieldAlert, Sparkles, Box } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const AiIntelligence: React.FC = () => {
  const [activeAiTool, setActiveAiTool] = useState<'segmentation' | 'dynamic-removal' | 'damage' | 'change-detect'>('segmentation');
  const [temporalSlider, setTemporalSlider] = useState<number>(50);

  const aiTools = [
    {
      id: 'segmentation',
      title: '3D SEMANTIC SEGMENTATION',
      status: 'ADVANCED' as const,
      model: 'SegFormer-B4 / PointNeXt-3D',
      desc: 'Classifies continuous polygonal mesh surfaces into functional urban and terrain categories, calculating true ground footprints.',
      classes: [
        { name: 'Structures & Buildings', color: 'bg-white text-black', border: 'border-white', area: '14,820 M²' },
        { name: 'Paved Arteries & Roads', color: 'bg-slate-300 text-black', border: 'border-slate-300', area: '8,450 M²' },
        { name: 'High/Low Vegetation', color: 'bg-slate-600 text-white', border: 'border-slate-600', area: '22,100 M²' },
        { name: 'Water & Fluvial Basins', color: 'bg-slate-800 text-white', border: 'border-slate-800', area: '6,240 M²' },
      ]
    },
    {
      id: 'dynamic-removal',
      title: 'DYNAMIC OBJECT & GHOST CULLING',
      status: 'ADVANCED' as const,
      model: 'YOLOv10-X + Optical Flow Masking',
      desc: 'Detects and masks moving vehicles, trains, and pedestrians before multi-view stereo, preventing phantom floating geometry streaks.',
      classes: [
        { name: 'Moving Highway Vehicles', color: 'bg-white text-black', border: 'border-white', area: '38 OBJECTS CULLED' },
        { name: 'Shadow Artifact Correction', color: 'bg-slate-400 text-black', border: 'border-slate-400', area: '100% GROUND RETAINED' },
      ]
    },
    {
      id: 'damage',
      title: 'STRUCTURAL DEFECT & CRACK AI',
      status: 'ADVANCED' as const,
      model: 'DefectNet-UAV (Sub-pixel Convolution)',
      desc: 'Localizes structural micro-fractures along concrete bridge piers, corrosion spalling on silos, and roof membrane tears.',
      classes: [
        { name: 'Pier 3 Vertical Fracture', color: 'bg-amber-400 text-black', border: 'border-amber-400', area: 'WIDTH: 1.42MM &bull; SEVERITY: MODERATE' },
        { name: 'Silo Rivet Shear Deflection', color: 'bg-white text-black', border: 'border-white', area: 'DEFLECTION: 4.2MM' },
      ]
    },
    {
      id: 'change-detect',
      title: 'VOLUMETRIC CHANGE DETECTION (M3C2)',
      status: 'ADVANCED' as const,
      model: 'Multiscale Model-to-Model Cloud Comparison',
      desc: 'Compares two temporal flight passes to compute volumetric excavation, embankment erosion, or post-disaster flood surge.',
      classes: [
        { name: 'Excavation Volume (Cut)', color: 'bg-white text-black', border: 'border-white', area: '+1,840 M³' },
        { name: 'Sediment Inundation (Fill)', color: 'bg-slate-400 text-black', border: 'border-slate-400', area: '-320 M³' },
      ]
    }
  ];

  const currentTool = aiTools.find((t) => t.id === activeAiTool) || aiTools[0];

  return (
    <section id="ai-intel" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>SPATIAL.INTELLIGENCE // AI ANALYTICS LAYER</span>
              <StatusBadge status="ADVANCED" size="sm" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              The World Is Reconstructed. <br />
              <span className="text-slate-400">Now Let It Be Understood.</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            AI is not a buzzword—it is an engineering analysis layer acting directly upon photogrammetric meshes
            and 3D point clouds. Semantic segmentation, dynamic object removal, crack localization, and volumetric change.
          </div>
        </div>

        {/* AI Tool Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6 font-mono text-xs">
          {aiTools.map((tool) => {
            const isSelected = tool.id === activeAiTool;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveAiTool(tool.id as any)}
                className={`p-3.5 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-xl'
                    : 'bg-[#05070A] border-white/15 hover:border-white/30 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                    {tool.model}
                  </span>
                  <StatusBadge status={tool.status} size="sm" />
                </div>
                <h3 className={`font-display font-bold text-xs uppercase ${isSelected ? 'text-black' : 'text-white'}`}>
                  {tool.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Interactive AI Inspection Frame */}
        <div className="border border-white/20 bg-[#05070B] overflow-hidden hud-bracket-container">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          {/* Top Status Strip */}
          <div className="bg-black/90 px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3 text-white">
              <Cpu className="w-4 h-4 text-white" />
              <span className="font-bold">{currentTool.title}</span>
              <span className="text-white/20">|</span>
              <span className="text-slate-400 text-[11px]">{currentTool.model}</span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>ACCURACY: mIoU 84.6%</span>
              <span className="text-white/20">•</span>
              <span>INFERENCE: 24 MS / TILE</span>
            </div>
          </div>

          {/* Interactive Screen Area */}
          <div className="relative h-[380px] sm:h-[440px] w-full bg-black overflow-hidden flex items-center justify-center select-none">
            {/* 1. SEMANTIC SEGMENTATION */}
            {activeAiTool === 'segmentation' && (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80"
                  alt="Aerial Semantic Segmentation"
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75"
                />
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500">
                  {/* Structures */}
                  <polygon points="120,180 340,160 380,310 160,340" fill="rgba(255, 255, 255, 0.25)" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="180" y="250" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">
                    [CLASS 01] STRUCTURE A [98.4%]
                  </text>

                  {/* Roadways */}
                  <polygon points="420,100 480,100 780,480 710,480" fill="rgba(203, 213, 225, 0.2)" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="540" y="300" fill="#CBD5E1" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold">
                    [CLASS 02] ARTERY PAVEMENT
                  </text>

                  {/* Vegetation */}
                  <polygon points="620,120 920,80 960,320 680,260" fill="rgba(100, 116, 139, 0.25)" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="740" y="200" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold">
                    [CLASS 03] CANOPY COVER
                  </text>
                </svg>
              </div>
            )}

            {/* 2. DYNAMIC GHOST CULLING */}
            {activeAiTool === 'dynamic-removal' && (
              <div className="relative w-full h-full bg-black flex items-center justify-center p-6">
                <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 380">
                  <rect x="100" y="110" width="600" height="150" fill="#080C12" stroke="#222F42" strokeWidth="1" />
                  <line x1="100" y1="185" x2="700" y2="185" stroke="#475569" strokeWidth="1.5" strokeDasharray="8 8" />

                  {/* Culled Vehicle 1 */}
                  <g transform="translate(240, 140)">
                    <rect x="0" y="0" width="80" height="35" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="0" y="-8" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold">
                      DYNAMIC ENTITY [CULLED]
                    </text>
                    <text x="10" y="22" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="10">
                      18.4 M/S
                    </text>
                  </g>

                  {/* Culled Vehicle 2 */}
                  <g transform="translate(480, 200)">
                    <rect x="0" y="0" width="90" height="40" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="0" y="-8" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold">
                      HEAVY CARRIER [CULLED]
                    </text>
                    <text x="14" y="25" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="10">
                      12.2 M/S
                    </text>
                  </g>
                </svg>
                <div className="absolute bottom-6 font-mono text-xs text-white bg-black px-4 py-1.5 border border-white/30">
                  &bull; DYNAMIC TARGETS MASKED: ZERO GHOST GEOMETRIES IN 3D SURFACE
                </div>
              </div>
            )}

            {/* 3. CRACK & DEFECT LOCALIZATION */}
            {activeAiTool === 'damage' && (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1600&q=80"
                  alt="Concrete Pier Inspection"
                  className="w-full h-full object-cover filter grayscale contrast-150"
                />
                <div className="absolute top-24 left-1/3 bg-black/90 p-4 border border-white font-mono text-xs text-white max-w-xs shadow-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <ShieldAlert className="w-4 h-4" />
                    <span>DEFECT #042 // LONGITUDINAL FRACTURE</span>
                  </div>
                  <div>LOCATION: Pier 3 West Face</div>
                  <div>WIDTH: 1.42 MM (Threshold &gt; 1.0mm)</div>
                  <div>SEVERITY: MODERATE HIGH</div>
                  <div className="text-emerald-400 text-[10px] pt-1 border-t border-white/10">
                    &bull; CAD ANNOTATION LOGGED
                  </div>
                </div>
              </div>
            )}

            {/* 4. TEMPORAL CHANGE DETECTION */}
            {activeAiTool === 'change-detect' && (
              <div className="relative w-full h-full">
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `polygon(0 0, ${temporalSlider}% 0, ${temporalSlider}% 100%, 0 100%)` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80"
                    alt="Baseline Survey T0"
                    className="w-full h-full object-cover filter grayscale"
                  />
                  <div className="absolute top-6 left-6 font-mono text-xs bg-black px-3 py-1 border border-white/30 text-white">
                    SURVEY T0: PRE-DISASTER BASELINE
                  </div>
                </div>

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `polygon(${temporalSlider}% 0, 100% 0, 100% 100%, ${temporalSlider}% 100%)` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80"
                    alt="Survey T1 Post-Disaster"
                    className="w-full h-full object-cover filter grayscale contrast-150 brightness-75"
                  />
                  <div className="absolute top-6 right-6 font-mono text-xs bg-black px-3 py-1 border border-white text-white">
                    SURVEY T1: POST-FLOOD INUNDATION (+1,840 M³ NET EROSION)
                  </div>
                </div>

                {/* Slider bar */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-white cursor-ew-resize z-20 shadow-[0_0_10px_#FFFFFF]"
                  style={{ left: `${temporalSlider}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white text-black flex items-center justify-center font-mono text-xs font-bold">
                    ↔
                  </div>
                </div>

                <input
                  type="range"
                  min="5"
                  max="95"
                  value={temporalSlider}
                  onChange={(e) => setTemporalSlider(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  aria-label="Compare baseline vs current survey"
                />
              </div>
            )}
          </div>

          {/* Bottom AI Analytics Legend */}
          <div className="bg-[#040609] p-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {currentTool.classes.map((cls, idx) => (
              <div key={idx} className="bg-black p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 ${cls.color} border ${cls.border}`} />
                  <span className="text-white font-bold truncate text-[11px]">{cls.name}</span>
                </div>
                <div className="text-slate-300 text-[10px]">{cls.area}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
