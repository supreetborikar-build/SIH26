import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 - 6', action: 'Switch 3D Shaders (Textured, Sparse, Dense, Wire, Elevation, AI)' },
    { key: 'M', action: 'Toggle 3D Metric Measurement Caliper mode' },
    { key: 'R', action: 'Reset 3D camera to default 45° vantage point' },
    { key: 'N', action: 'Switch to orthogonal Nadir (top-down) survey view' },
    { key: 'F', action: 'Toggle drone flight trajectory & camera frustums' },
    { key: 'A', action: 'Toggle synthesized aerospace telemetry audio feedback' },
    { key: '?', action: 'Toggle this keyboard command cheat sheet' },
    { key: 'ESC', action: 'Close modal or clear active measurement pins' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="bg-[#05070B] border border-white/30 max-w-md w-full p-6 shadow-2xl font-mono text-xs hud-bracket-container">
        <div className="hud-bracket-tl" />
        <div className="hud-bracket-tr" />
        <div className="hud-bracket-bl" />
        <div className="hud-bracket-br" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-white">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-white" />
            <span className="font-bold tracking-wider uppercase">OPERATOR KEYBOARD BINDINGS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-400 font-sans text-xs mb-4">
          AeroTwin 3D supports CAD-grade keyboard commands for rapid 3D inspection and photogrammetric analysis.
        </p>

        <div className="space-y-1.5">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between bg-black p-2 border border-white/10">
              <span className="px-2 py-0.5 bg-white/10 border border-white/20 font-bold text-white text-[10px]">
                {sc.key}
              </span>
              <span className="text-slate-300 text-right text-[11px] font-sans">{sc.action}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 text-center text-[10px] text-slate-500">
          PRESS <span className="text-white font-bold">ESC</span> OR CLICK OUTSIDE TO RETURN TO MISSION HUD
        </div>
      </div>
    </div>
  );
};
