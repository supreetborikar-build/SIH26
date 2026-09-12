import React, { useEffect, useState } from 'react';
import { CursorMode } from '../../types/aerial';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AerospaceCursorProps {
  mode: CursorMode;
}

export const AerospaceCursor: React.FC<AerospaceCursorProps> = ({ mode }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  if (isTouch || prefersReducedMotion || !visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out select-none"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative w-7 h-7 flex items-center justify-center">
        {/* Outer 1px Reticle Ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-200 ${
            mode === 'MEASURE'
              ? 'border-amber-400/80 scale-125 border-dashed animate-spin'
              : mode === 'INSPECT'
              ? 'border-white scale-110'
              : 'border-white/40 scale-100'
          }`}
          style={{ animationDuration: '10s' }}
        />

        {/* Center Target Dot */}
        <div
          className={`w-1 h-1 rounded-full ${
            mode === 'MEASURE' ? 'bg-amber-400' : 'bg-white'
          }`}
        />

        {/* Hairline Crosshair Lines */}
        <div className="absolute top-0 w-px h-1.5 bg-white/60 -translate-y-1" />
        <div className="absolute bottom-0 w-px h-1.5 bg-white/60 translate-y-1" />
        <div className="absolute left-0 h-px w-1.5 bg-white/60 -translate-x-1" />
        <div className="absolute right-0 h-px w-1.5 bg-white/60 translate-x-1" />

        {/* Monospaced Coordinate Readout */}
        <div className="absolute left-6 top-4 whitespace-nowrap bg-black px-1.5 py-0.5 border border-white/20 text-[9px] font-mono tracking-wider flex items-center gap-1.5 text-white shadow-lg">
          <span className="text-slate-400 font-bold">[{mode}]</span>
          <span className="text-slate-300 text-[8px]">
            {Math.round(pos.x)},{Math.round(pos.y)}
          </span>
        </div>
      </div>
    </div>
  );
};
