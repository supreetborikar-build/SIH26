import React, { useState } from 'react';
import { PIPELINE_STAGES } from '../../data/datasets';
import { PipelineStage } from '../../types/aerial';
import { StatusBadge } from '../common/StatusBadge';
import { Cpu, ArrowRight, Layers, FileCode, CheckCircle2, ChevronRight } from 'lucide-react';

export const PipelineArchitecture: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);

  return (
    <section id="architecture" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>SYSTEM.PIPELINE // 16 COMPUTATIONAL STAGES</span>
              <StatusBadge status="IMPLEMENTED" size="sm" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
              16-Stage Aerial <br />
              <span className="text-slate-400">Reconstruction Engine</span>
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Engineering documentation transformed into an interactive system schematic.
            Click any processing stage to inspect the underlying mathematical formulations,
            data contracts, and algorithmic implementations.
          </div>
        </div>

        {/* Interactive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
          {/* Left Column: 16-Stage Node Sequence */}
          <div className="lg:col-span-6 space-y-2 max-h-[620px] overflow-y-auto pr-2">
            {PIPELINE_STAGES.map((stg) => {
              const isSelected = stg.id === selectedStage.id;
              return (
                <div
                  key={stg.id}
                  onClick={() => setSelectedStage(stg)}
                  className={`p-3 border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-xl'
                      : 'bg-[#05070B] border-white/15 hover:border-white/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                      isSelected ? 'border-black text-black' : 'border-white/20 text-white'
                    }`}>
                      {stg.index}
                    </span>
                    <div>
                      <div className={`font-display font-bold text-xs uppercase ${isSelected ? 'text-black' : 'text-white'}`}>
                        {stg.title}
                      </div>
                      <div className={`text-[9px] ${isSelected ? 'text-slate-700' : 'text-slate-500'}`}>
                        {stg.category.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={stg.status} size="sm" />
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Technical Inspector Card */}
          <div className="lg:col-span-6 bg-[#05070B] border border-white/20 p-6 shadow-2xl sticky top-20 hud-bracket-container">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="text-[10px] text-slate-400">
                <span>PHASE {selectedStage.index} SPECIFICATION</span>
                <span className="text-white/20 mx-2">|</span>
                <span className="text-white font-bold">{selectedStage.category.toUpperCase()}</span>
              </div>
              <StatusBadge status={selectedStage.status} size="md" />
            </div>

            <h3 className="text-xl font-display font-extrabold text-white uppercase mb-2">
              {selectedStage.title}
            </h3>

            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-5">
              {selectedStage.shortDesc}
            </p>

            {/* Mathematical Formulation */}
            <div className="mb-4">
              <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-white" />
                <span>MATHEMATICAL &amp; GEOMETRIC FORMULATION</span>
              </div>
              <div className="bg-black border border-white/10 p-3 font-mono text-xs text-white overflow-x-auto">
                {selectedStage.mathematicalBasis}
              </div>
            </div>

            {/* Data Contracts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs">
              <div className="bg-black p-3 border border-white/10">
                <div className="text-[9px] text-slate-500 mb-0.5">INPUT DATA</div>
                <div className="text-white text-[10px]">{selectedStage.input}</div>
              </div>

              <div className="bg-black p-3 border border-white/10">
                <div className="text-[9px] text-slate-500 mb-0.5">OUTPUT ARTIFACT</div>
                <div className="text-white text-[10px] font-bold">{selectedStage.output}</div>
              </div>
            </div>

            {/* Metric Benchmark */}
            <div className="bg-black p-3 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[10px]">BENCHMARK CRITERION:</span>
              <span className="text-emerald-400 font-bold text-[11px]">{selectedStage.metrics}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
