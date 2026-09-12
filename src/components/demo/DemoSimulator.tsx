import React, { useState } from 'react';
import { Upload, Play, CheckCircle2, RotateCw, Terminal, FileVideo, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface DemoSimulatorProps {
  onReconstructComplete: () => void;
}

export const DemoSimulator: React.FC<DemoSimulatorProps> = ({ onReconstructComplete }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('preset-alpha');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeLog, setActiveLog] = useState<string[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);

  const presets = [
    {
      id: 'preset-alpha',
      name: 'FLIGHT ALPHA // INDUSTRIAL FACILITY',
      frames: '384 Keyframes',
      size: '2.4 GB 4K/60',
      gpsTrack: 'RTK Locked (22 SVs)'
    },
    {
      id: 'preset-bravo',
      name: 'FLIGHT BRAVO // VIADUCT ABUTMENT',
      frames: '512 Keyframes',
      size: '3.1 GB 4K/60',
      gpsTrack: 'High-Elevation Pass'
    },
    {
      id: 'preset-charlie',
      name: 'FLIGHT CHARLIE // RIVERBANK INUNDATION',
      frames: '290 Keyframes',
      size: '1.8 GB 1080p/60',
      gpsTrack: 'Emergency Corridor'
    }
  ];

  const pipelineLogs = [
    'INGEST: Reading monocular H.265 video stream & NTP flight telemetry...',
    'QUALITY: Evaluating Laplacian variance across 3,600 raw frames...',
    'FILTER: Culling 82.4% redundant frames; 384 salient keyframes locked.',
    'CALIB: Solving Brown-Conrady camera intrinsic matrix K (f=24.0mm).',
    'FEATURES: Extracting SIFT scale-space keypoints (avg 3,850 pts/frame)...',
    'MATCHING: Establishing pairwise cross-frame correspondences (2,450 pairs)...',
    'RANSAC: Inlier ratio 82.5%; Fundamental matrix F validated.',
    'SfM: Decomposing Essential matrix E -> P3P relative camera poses [R|t].',
    'BUNDLE: Global Levenberg-Marquardt bundle adjustment converged (res=0.68px).',
    'MVS: PatchMatch photometric depth aggregation -> 1,284,000 dense points.',
    'OUTLIER: Statistical k-NN distance filter culled 99.1% atmospheric noise.',
    'POISSON: Screened Poisson surface reconstruction generated watertight mesh.',
    'TEXTURE: Projecting multi-view UV diffuse texture atlas (4K PBR).',
    'GEOREF: 7-parameter Sim(3) transform anchored to WGS-84 / UTM 43N.',
    'AI READY: 3D Digital Twin ready for spatial inspection and measurement!'
  ];

  const handleStartReconstruction = () => {
    setIsProcessing(true);
    setProgress(0);
    setActiveLog(['[INITIALIZING AEROTWIN RECONSTRUCTION PIPELINE]']);
    setIsDone(false);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 7;
      setProgress(Math.min(100, currentProgress));

      const logIdx = Math.floor((currentProgress / 100) * pipelineLogs.length);
      if (logIdx < pipelineLogs.length) {
        setActiveLog((prev) => {
          if (!prev.includes(pipelineLogs[logIdx])) {
            return [...prev, pipelineLogs[logIdx]];
          }
          return prev;
        });
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsDone(true);
      }
    }, 450);
  };

  return (
    <section id="demo" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>INTERACTIVE DEMO // RECONSTRUCTION WORKBENCH</span>
              <StatusBadge status="IMPLEMENTED" size="sm" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              Experience The System <br />
              <span className="text-slate-400">Live Ingestion Workbench</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Select an operational drone flight dataset or simulate a custom raw video upload.
            Watch real-time frame filtering, Structure-from-Motion bundle adjustment,
            and mesh reconstruction execute.
          </div>
        </div>

        {/* Workbench Container */}
        <div className="bg-[#05070B] border border-white/20 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 hud-bracket-container">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          {/* Left Column: Preset Selection & Action */}
          <div className="lg:col-span-5 space-y-3 font-mono">
            <div className="text-[10px] text-slate-500 mb-1">
              [STEP 01] SELECT FLIGHT MANIFEST:
            </div>

            {presets.map((p) => {
              const isSelected = p.id === selectedPreset;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (!isProcessing) {
                      setSelectedPreset(p.id);
                      setIsDone(false);
                      setProgress(0);
                      setActiveLog([]);
                    }
                  }}
                  className={`p-3.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-xl'
                      : 'bg-black border-white/15 hover:border-white/30 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold uppercase ${isSelected ? 'text-black' : 'text-white'}`}>
                      {p.name}
                    </span>
                    <FileVideo className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-slate-500'}`} />
                  </div>
                  <div className={`flex items-center justify-between text-[9px] mt-1.5 ${
                    isSelected ? 'text-slate-700' : 'text-slate-500'
                  }`}>
                    <span>{p.frames}</span>
                    <span>{p.size}</span>
                    <span className={isSelected ? 'text-black font-semibold' : 'text-white'}>{p.gpsTrack}</span>
                  </div>
                </div>
              );
            })}

            {/* Custom Upload Dropzone */}
            <label className="block p-3.5 border border-dashed border-white/20 bg-black text-center text-xs text-slate-400 hover:border-white hover:text-white transition-all cursor-pointer">
              <input
                type="file"
                accept="video/*,.csv,.nmea,.gpx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const mbSize = (file.size / (1024 * 1024)).toFixed(1);
                    setSelectedPreset('custom-upload');
                    setIsDone(false);
                    setProgress(0);
                    setActiveLog([`INGEST: Loaded user asset "${file.name}" (${mbSize} MB). Ready to extract frames.`]);
                  }
                }}
              />
              <Upload className="w-4 h-4 mx-auto mb-1 text-white" />
              <div className="font-bold text-white text-[11px]">UPLOAD DRONE MP4 / FLIGHT LOG</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Supports 4K H.264/H.265 &amp; GPS NMEA logs</div>
            </label>

            {/* Trigger Button */}
            <button
              onClick={isDone ? onReconstructComplete : handleStartReconstruction}
              disabled={isProcessing}
              className={`w-full py-3.5 font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDone
                  ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                  : isProcessing
                  ? 'bg-white/20 text-white border border-white/40 cursor-wait'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>PROCESSING PIPELINE ({progress}%)</span>
                </>
              ) : isDone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span>RECONSTRUCTION COMPLETE &bull; OPEN 3D</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>EXECUTE 3D RECONSTRUCTION</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Terminal Logs */}
          <div className="lg:col-span-7 bg-black border border-white/15 p-5 flex flex-col justify-between font-mono">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-xs">
              <div className="flex items-center gap-2 text-white">
                <Terminal className="w-3.5 h-3.5 text-white" />
                <span className="font-bold">SYSTEM STDOUT LOG</span>
              </div>
              <div className="text-[9px] text-slate-400">
                THREAD: GPU-MVS &bull; CUDA 12.4
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>EXECUTION PROGRESS:</span>
                <span className="text-white font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Terminal Logs Output */}
            <div className="bg-[#030508] p-3 border border-white/5 h-64 overflow-y-auto space-y-1 text-xs text-slate-300 custom-scrollbar select-text">
              {activeLog.length === 0 ? (
                <div className="text-slate-600 italic text-[11px]">
                  &gt; Ingestion engine ready. Click 'EXECUTE 3D RECONSTRUCTION' to initialize.
                </div>
              ) : (
                activeLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-slate-500">&gt;</span>
                    <span className={idx === activeLog.length - 1 ? 'text-white font-semibold' : 'text-slate-400'}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Terminal Footer */}
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-500">
              <span>LEVENBERG-MARQUARDT CONVERGENCE</span>
              <span>RESIDUAL: 0.68 PX</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
