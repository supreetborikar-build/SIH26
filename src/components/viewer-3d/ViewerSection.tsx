import React, { useState } from 'react';
import { DATASETS } from '../../data/datasets';
import { DatasetItem, ViewerRenderMode, MeasurementResult } from '../../types/aerial';
import { ThreeCanvas } from './ThreeCanvas';
import { StatusBadge } from '../common/StatusBadge';
import { Compass, Box, Layers, MapPin, Check, Info } from 'lucide-react';

interface ViewerSectionProps {
  onMeasureSelect?: () => void;
}

export const ViewerSection: React.FC<ViewerSectionProps> = () => {
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem>(DATASETS[0]);
  const [renderMode, setRenderMode] = useState<ViewerRenderMode>('textured');
  const [showFrustums, setShowFrustums] = useState<boolean>(true);
  const [isMeasureMode, setIsMeasureMode] = useState<boolean>(false);
  const [measurement, setMeasurement] = useState<MeasurementResult>({
    p1: null,
    p2: null,
    euclideanDistMeters: 0,
    horizontalDistMeters: 0,
    verticalDeltaMeters: 0,
    slopeDegrees: 0,
    confidenceScore: 0,
  });

  // Global Keyboard Navigation for CAD power-users
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') setRenderMode('textured');
      else if (e.key === '2') setRenderMode('sparse');
      else if (e.key === '3') setRenderMode('dense');
      else if (e.key === '4') setRenderMode('wireframe');
      else if (e.key === '5') setRenderMode('elevation');
      else if (e.key === '6') setRenderMode('segmentation');
      else if (e.key.toLowerCase() === 'm') setIsMeasureMode((prev) => !prev);
      else if (e.key.toLowerCase() === 'f') setShowFrustums((prev) => !prev);
      else if (e.key === 'Escape') {
        setIsMeasureMode(false);
        setMeasurement({
          p1: null,
          p2: null,
          euclideanDistMeters: 0,
          horizontalDistMeters: 0,
          verticalDeltaMeters: 0,
          slopeDegrees: 0,
          confidenceScore: 0,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="viewer-3d" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>DIGITAL.WORLD // 3D WORKSTATION</span>
              <StatusBadge status="IMPLEMENTED" size="sm" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              Now, Explore The <br />
              <span className="text-slate-400">World You Just Built.</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Full 6-DoF hardware-accelerated 3D WebGL inspection. Switch between dense point clouds,
            wireframes, and textured surfaces. Inspect camera flight trajectory and measure metric dimensions.
          </div>
        </div>

        {/* Dataset Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {DATASETS.map((ds) => {
            const isSelected = ds.id === selectedDataset.id;
            return (
              <button
                key={ds.id}
                onClick={() => {
                  setSelectedDataset(ds);
                  setIsMeasureMode(false);
                }}
                className={`p-4 text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-xl'
                    : 'bg-[#05070A] border-white/15 hover:border-white/30 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1 font-mono text-[9px]">
                    <span className={`font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                      {ds.environmentType.toUpperCase()} RECONSTRUCTION
                    </span>
                    <span className={isSelected ? 'text-slate-700' : 'text-slate-500'}>{ds.flightDuration}</span>
                  </div>
                  <h3 className={`font-display font-bold text-sm uppercase ${isSelected ? 'text-black' : 'text-white'}`}>
                    {ds.title}
                  </h3>
                  <p className={`text-xs font-sans mt-1 line-clamp-2 ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                    {ds.summary}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t flex items-center justify-between font-mono text-[9px] ${
                  isSelected ? 'border-black/20 text-slate-800' : 'border-white/10 text-slate-400'
                }`}>
                  <span>POINTS: {(ds.reconstructedPoints / 1000).toFixed(0)}K</span>
                  <span>GSD: {ds.gsdCmPerPx} CM/PX</span>
                  {isSelected && <span className="font-bold text-black">&bull; ACTIVE MANIFEST</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D WebGL Viewport */}
        <div className="h-[540px] sm:h-[620px] w-full relative mb-6">
          <ThreeCanvas
            currentDataset={selectedDataset}
            renderMode={renderMode}
            onRenderModeChange={setRenderMode}
            showFrustums={showFrustums}
            onToggleFrustums={() => setShowFrustums(!showFrustums)}
            isMeasureMode={isMeasureMode}
            onToggleMeasureMode={() => setIsMeasureMode(!isMeasureMode)}
            measurement={measurement}
            onMeasurementUpdate={setMeasurement}
          />
        </div>

        {/* Dataset Technical Metadata Matrix */}
        <div className="bg-[#05070B] border border-white/15 p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-black p-2.5 border border-white/10">
            <div className="text-[9px] text-slate-500">COORDINATES</div>
            <div className="text-white font-bold text-[11px] mt-0.5">
              {selectedDataset.coordinates[0]}°N, {selectedDataset.coordinates[1]}°E
            </div>
          </div>

          <div className="bg-black p-2.5 border border-white/10">
            <div className="text-[9px] text-slate-500">ALTITUDE AGL</div>
            <div className="text-white font-bold text-[11px] mt-0.5">{selectedDataset.altitude} M AGL</div>
          </div>

          <div className="bg-black p-2.5 border border-white/10">
            <div className="text-[9px] text-slate-500">KEYFRAMES</div>
            <div className="text-white font-bold text-[11px] mt-0.5">{selectedDataset.framesExtracted} FRAMES</div>
          </div>

          <div className="bg-black p-2.5 border border-white/10">
            <div className="text-[9px] text-slate-500">MESH FACETS</div>
            <div className="text-white font-bold text-[11px] mt-0.5">
              {(selectedDataset.meshTriangles / 1000).toFixed(1)}K FACETS
            </div>
          </div>

          <div className="bg-black p-2.5 border border-white/10">
            <div className="text-[9px] text-slate-500">GSD RESOLUTION</div>
            <div className="text-white font-bold text-[11px] mt-0.5">{selectedDataset.gsdCmPerPx} CM / PX</div>
          </div>

          <div className="bg-black p-2.5 border border-white/10">
            <div className="text-[9px] text-slate-500">SPATIAL DATUM</div>
            <div className="text-emerald-400 font-bold text-[11px] mt-0.5">WGS 84 / UTM 43N</div>
          </div>
        </div>
      </div>
    </section>
  );
};
