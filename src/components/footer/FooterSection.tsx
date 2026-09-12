import React from 'react';
import { Crosshair, Shield, ArrowUp, ExternalLink, Terminal } from 'lucide-react';

interface FooterSectionProps {
  onBackToTop: () => void;
  onJumpToSection: (sectionId: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onBackToTop, onJumpToSection }) => {
  return (
    <footer className="bg-black border-t border-white/10 text-slate-400 font-mono text-xs py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Mission Complete Banner */}
        <div className="border border-white/20 bg-[#05070B] p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 hud-bracket-container">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          <div>
            <div className="text-[10px] text-slate-500 uppercase">SYSTEM MANIFEST STATE</div>
            <div className="text-xl sm:text-2xl font-display font-extrabold text-white uppercase tracking-tight">
              MISSION COMPLETE // SYSTEM READY
            </div>
            <div className="text-xs text-slate-300 mt-1">
              ONE FLIGHT &rarr; DATA &rarr; GEOMETRY &rarr; 3D WORLD &rarr; INTELLIGENCE
            </div>
          </div>

          <button
            onClick={onBackToTop}
            className="px-4 py-2 bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer self-start md:self-auto"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>RETURN TO TOP</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          {/* Brand & Narrative */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white" />
              <span className="font-display font-bold text-white text-base tracking-widest uppercase">
                AEROTWIN.3D
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
              Single-Pass Aerial Motion to Spatial Intelligence. Autonomous photogrammetry,
              Extended Kalman Filter sensor fusion, and metric 3D digital twin platform.
            </p>

            <div className="text-[10px] text-white flex items-center gap-1.5 pt-1">
              <Shield className="w-3.5 h-3.5 text-white" />
              <span>SPONSOR: NTRO (NATIONAL TECHNICAL RESEARCH ORGANISATION)</span>
            </div>
          </div>

          {/* Quick System Links */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
              SYSTEM SECTIONS
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                { label: '01. RECONSTRUCT', id: 'transformation' },
                { label: '02. SfM PIPELINE', id: 'sfm-pipeline' },
                { label: '03. 3D TWIN', id: 'viewer-3d' },
                { label: '04. SENSOR FUSION', id: 'sensor-fusion' },
                { label: '05. AI INTEL', id: 'ai-intel' },
                { label: '06. ARCHITECTURE', id: 'architecture' },
                { label: '07. TECH SPECS', id: 'technical-specs' },
                { label: '08. LIVE DEMO', id: 'demo' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => onJumpToSection(link.id)}
                  className="text-left text-slate-400 hover:text-white transition-colors py-1 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Credentials */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
              COMPLIANCE AUDIT
            </div>
            <div className="bg-[#05070B] p-3 border border-white/10 space-y-1 text-[10px]">
              <div>PROBLEM ID: <span className="text-white font-bold">SIH26158</span></div>
              <div>THEME: <span className="text-slate-300">Robotics &amp; Drones</span></div>
              <div>CATEGORY: <span className="text-slate-300">SOFTWARE</span></div>
              <div className="text-emerald-400 pt-1 border-t border-white/10">
                ✓ ALL SPECIFICATIONS VERIFIED
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500">
          <div>
            AEROTWIN 3D // SMART INDIA HACKATHON 2026 // NTRO PS SIH26158
          </div>
          <div>
            COORDINATES: WGS 84 / UTM 43N &bull; 60 FPS WEBLAB
          </div>
        </div>
      </div>
    </footer>
  );
};
