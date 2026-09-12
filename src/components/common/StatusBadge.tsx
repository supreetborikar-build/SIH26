import React from 'react';
import { ImplementationStatus } from '../../types/aerial';

interface StatusBadgeProps {
  status: ImplementationStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'IMPLEMENTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border ${
            isSm ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
          } bg-white/5 text-white border-white/25 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          IMPLEMENTED
        </span>
      );
    case 'ADVANCED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border ${
            isSm ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
          } bg-white/5 text-slate-300 border-amber-500/40 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-xs bg-amber-400" />
          ADVANCED
        </span>
      );
    case 'PROPOSED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border border-dashed ${
            isSm ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
          } bg-black text-slate-400 border-white/20 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full border border-white/40" />
          PROPOSED
        </span>
      );
  }
};
