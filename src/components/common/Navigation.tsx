import React, { useState } from 'react';
import { Crosshair, Radio, Compass, Menu, X, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { TelemetryState } from '../../types/aerial';
import { audioTelemetry } from '../../utils/audioTelemetry';

interface NavigationProps {
  telemetry: TelemetryState;
  onOpenTelemetry?: () => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenShortcuts: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  telemetry,
  onJumpToSection,
  onOpenShortcuts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    audioTelemetry.enabled = next;
    if (next) {
      audioTelemetry.playLock();
    }
  };

  const navLinks = [
    { label: '01 / RECONSTRUCT', target: 'transformation' },
    { label: '02 / SfM PIPELINE', target: 'sfm-pipeline' },
    { label: '03 / 3D TWIN', target: 'viewer-3d' },
    { label: '04 / SENSORS', target: 'sensor-fusion' },
    { label: '05 / AI INTEL', target: 'ai-intel' },
    { label: '06 / ARCHITECTURE', target: 'architecture' },
    { label: '07 / SPECS', target: 'technical-specs' },
  ];

  const handleNavClick = (target: string) => {
    audioTelemetry.playBlip();
    onJumpToSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Mission Tag */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-white/30 flex items-center justify-center text-white relative">
            <span className="w-1.5 h-1.5 bg-white" />
            <div className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                AEROTWIN.3D
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 border border-white/20 text-[9px] font-mono text-slate-400">
                NTRO // SIH26158
              </span>
            </div>
            <div className="text-[8px] font-mono text-slate-500 tracking-wider">
              AERIAL INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors tracking-wider flex items-center gap-1 cursor-pointer focus:outline-none focus:text-white px-1 py-0.5"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* System Telemetry Readout & Actions */}
        <div className="hidden md:flex items-center gap-2.5 font-mono text-xs">
          {/* Status Capsule */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#05070A] border border-white/10 text-slate-300 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500">SYS:</span>
            <span className="text-white font-bold">ONLINE</span>
            <span className="text-white/20">|</span>
            <span className="text-slate-500">GPS:</span>
            <span className="text-white font-semibold">LOCKED</span>
            <span className="text-white/20">|</span>
            <span className="text-slate-500">ALT:</span>
            <span className="text-white">{telemetry.altitudeAgl.toFixed(0)}M</span>
          </div>

          {/* Audio Feedback Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-1.5 border transition-colors cursor-pointer ${
              audioEnabled
                ? 'bg-white/10 border-white text-white'
                : 'bg-black border-white/15 text-slate-500 hover:text-white hover:border-white/30'
            }`}
            title={audioEnabled ? 'Mute Audio Telemetry' : 'Enable Audio Telemetry'}
            aria-label={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Shortcuts Help Button */}
          <button
            onClick={() => {
              audioTelemetry.playBlip();
              onOpenShortcuts();
            }}
            className="p-1.5 border border-white/15 bg-black text-slate-500 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Enter 3D Viewer */}
          <button
            onClick={() => handleNavClick('viewer-3d')}
            className="px-3 py-1 bg-white hover:bg-slate-200 text-black font-mono text-[11px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-black" />
            <span>ENTER 3D</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white border border-white/15 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-black px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pb-3 border-b border-white/10">
            <div>GPS: {telemetry.latitude.toFixed(4)}N, {telemetry.longitude.toFixed(4)}E</div>
            <div>STATUS: <span className="text-white font-bold">{telemetry.rtkStatus}</span></div>
          </div>
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="block w-full text-left py-2 px-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={toggleAudio}
              className="flex-1 py-1.5 border border-white/15 text-xs font-mono text-slate-300 flex items-center justify-center gap-1.5"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{audioEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShortcuts();
              }}
              className="flex-1 py-1.5 border border-white/15 text-xs font-mono text-slate-300 flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SHORTCUTS (?)</span>
            </button>
          </div>
          <button
            onClick={() => handleNavClick('viewer-3d')}
            className="w-full mt-2 py-2 bg-white text-black font-mono text-xs font-bold tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            ENTER 3D VIEWER
          </button>
        </div>
      )}
    </header>
  );
};
