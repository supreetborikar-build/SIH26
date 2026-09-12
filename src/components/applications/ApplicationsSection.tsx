import React, { useState } from 'react';
import { Shield, HardHat, Waves, Map, Building, Pickaxe, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ApplicationsSection: React.FC = () => {
  const [activeAppIndex, setActiveAppIndex] = useState(0);

  const applications = [
    {
      id: 'infrastructure',
      title: 'CRITICAL INFRASTRUCTURE INSPECTION',
      subtitle: 'Bridges, Energy Networks & Industrial Silos',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
      icon: HardHat,
      desc: 'Replace dangerous manual rope-access inspections with single-pass drone photogrammetry. Extract millimeter-accurate 3D digital twins of bridge piers, viaduct bearings, cooling arrays, and refinery networks.',
      deliverables: ['Sub-millimeter crack fracture maps', 'Pier verticality deviation metrics', 'Watertight BIM/CAD export'],
      metric: '92% INSPECTION TIME REDUCTION'
    },
    {
      id: 'disaster',
      title: 'DISASTER RELIEF & FLOOD EMERGENCY',
      subtitle: 'Post-Calamity Rapid Situational Awareness',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      icon: Waves,
      desc: 'When ground access is severed following floods, earthquakes, or landslides, a single drone pass generates a metric 3D model of levee breaches, collapsed spans, and inundated evacuation corridors.',
      deliverables: ['Fluvial inundation depth models', 'Submerged transport artery tags', 'Volumetric debris calculation'],
      metric: '3D TWIN GENERATED IN < 15 MIN'
    },
    {
      id: 'defense',
      title: 'STRATEGIC & BORDER RECONNAISSANCE',
      subtitle: 'NTRO Tactical Geospatial Intelligence',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
      icon: Shield,
      desc: 'Execute rapid 3D spatial terrain reconstruction in GPS-degraded or electronic warfare environments. Reconstruct hostile elevation profiles and line-of-sight analysis without ground survey teams.',
      deliverables: ['Line-of-sight 3D vantage analysis', 'Elevation concealment masks', 'Denied-environment visual odometry'],
      metric: 'ZERO GROUND CONTROL POINTS'
    },
    {
      id: 'construction',
      title: 'CONSTRUCTION MONITORING & EARTHWORKS',
      subtitle: 'As-Built Verification & Cut/Fill Audits',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      icon: Pickaxe,
      desc: 'Perform periodic drone surveys to compare physical construction progress against 4D BIM models. Automatically calculate volumetric earthwork excavation and stockpile volumes.',
      deliverables: ['Cut/Fill volumetric balance reports', 'As-Built vs BIM discrepancy heatmaps', 'Stockpile mass estimation'],
      metric: '±1.5% VOLUMETRIC PRECISION'
    },
    {
      id: 'urban',
      title: 'SMART CITIES & URBAN DIGITAL TWINS',
      subtitle: 'High-Density Spatial Asset Management',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      icon: Building,
      desc: 'Generate georeferenced LoD3 3D building models across municipal sectors. Calculate roof solar irradiance potential, urban canyon wind corridors, and property tax spatial registers.',
      deliverables: ['LoD2/LoD3 CityGML polygonal models', 'Rooftop solar surface area audits', 'Underground utility alignment'],
      metric: '1.85 CM / PX GROUND RESOLUTION'
    },
    {
      id: 'terrain',
      title: 'TERRAIN HYPSOMETRY & MINING SURVEYS',
      subtitle: 'Digital Elevation Models (DEM) & Slope Failure',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      icon: Map,
      desc: 'Reconstruct high-resolution Digital Terrain Models (DTM) and Digital Surface Models (DSM) for open-pit mines, geological slope stability, and watershed hydrology planning.',
      deliverables: ['0.5m interval contour maps', 'Slope failure hazard zonations', 'Fluvial catchment runoff vectors'],
      metric: '100% NON-CONTACT SURVEY'
    }
  ];

  const activeApp = applications[activeAppIndex];

  return (
    <section id="applications" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
            <span className="w-1.5 h-1.5 bg-white" />
            <span>OPERATIONAL PROFILES // STRATEGIC DEPLOYMENT</span>
            <StatusBadge status="IMPLEMENTED" size="sm" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
            Transforming Flight Into <br />
            <span className="text-slate-400">Tactical Intelligence</span>
          </h2>

          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm mt-4 font-sans leading-relaxed">
            From classified NTRO defense reconnaissance to emergency flood response and structural asset monitoring,
            single-pass photogrammetry delivers immediate spatial truth.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono">
          {/* Left Column: Mission Index List */}
          <div className="lg:col-span-5 space-y-2 flex flex-col justify-between">
            {applications.map((app, idx) => {
              const Icon = app.icon;
              const isActive = idx === activeAppIndex;
              return (
                <button
                  key={app.id}
                  onClick={() => setActiveAppIndex(idx)}
                  className={`p-3.5 text-left transition-all cursor-pointer border flex items-center justify-between ${
                    isActive
                      ? 'bg-white text-black border-white shadow-xl'
                      : 'bg-[#05070A] border-white/15 hover:border-white/30 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 border ${isActive ? 'border-black text-black' : 'border-white/20 text-white'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500">DOSSIER 0{idx + 1}</div>
                      <div className={`font-display font-bold text-xs uppercase ${isActive ? 'text-black' : 'text-white'}`}>
                        {app.title}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Narrative Dossier Card */}
          <div className="lg:col-span-7 bg-[#05070B] border border-white/20 overflow-hidden flex flex-col justify-between hud-bracket-container">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />

            {/* Visual Header */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={activeApp.image}
                alt={activeApp.title}
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Metric Stamp */}
              <div className="absolute top-4 right-4 bg-black px-3 py-1 border border-white font-mono text-[10px] text-white font-bold">
                {activeApp.metric}
              </div>

              {/* Header Title */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="font-mono text-[10px] text-slate-400 mb-0.5">{activeApp.subtitle}</div>
                <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  {activeApp.title}
                </h3>
              </div>
            </div>

            {/* Description & Deliverables */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeApp.desc}
              </p>

              <div className="border-t border-white/10 pt-4">
                <div className="font-mono text-[10px] text-slate-500 mb-2">KEY TACTICAL DELIVERABLES:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeApp.deliverables.map((del, i) => (
                    <div key={i} className="bg-black p-2.5 border border-white/10 font-mono text-[10px] text-white flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-white" />
                      <span className="truncate">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
