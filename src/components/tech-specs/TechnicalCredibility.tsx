import React from 'react';
import { Terminal, CheckCircle2, Shield, Users, Layers, Cpu, Box, Code } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const TechnicalCredibility: React.FC = () => {
  const stackItems = [
    {
      name: 'OpenCV & Computer Vision',
      role: 'Feature Extraction & Calibration',
      desc: 'SIFT/ORB feature detection, camera intrinsic calibration matrix K, Nistér 5-point algorithm, and RANSAC epipolar outlier filtering.',
      tag: 'Core CV'
    },
    {
      name: 'COLMAP & Sparse SfM',
      role: 'Incremental Structure-from-Motion',
      desc: 'Multiview bundle adjustment via Levenberg-Marquardt optimization; simultaneous camera trajectory recovery and 3D tie-point triangulation.',
      tag: 'SfM Geometry'
    },
    {
      name: 'Open3D Geometry Engine',
      role: 'Point Cloud & Poisson Meshing',
      desc: 'Multi-view stereo (MVS) point cloud consolidation, statistical outlier culling, oriented normal estimation, and Screened Poisson surface reconstruction.',
      tag: '3D Geometry'
    },
    {
      name: 'PyTorch Deep Learning',
      role: 'Semantic Masking & Change AI',
      desc: 'SegFormer-B4 aerial segmentation, YOLOv10-X moving vehicle masking, and M3C2 volumetric surface comparison networks.',
      tag: 'AI Models'
    },
    {
      name: 'Three.js & WebGL Shaders',
      role: 'Hardware-Accelerated 3D Client',
      desc: 'Hardware-accelerated 60 FPS spatial rendering, custom GLSL point-cloud shaders, 6-DoF orbit navigation, and 3D raycasting metrology.',
      tag: 'WebGL Engine'
    },
    {
      name: 'GeoPandas & PROJ GIS',
      role: 'Georeferencing & Spatial Datum',
      desc: 'WGS-84 ellipsoidal coordinates to UTM Zone 43N metric grid transformation, digital elevation model (DEM) projection, and GIS GeoTIFF export.',
      tag: 'Geospatial CRS'
    }
  ];

  const teamRoles = [
    { role: 'CV / SfM Lead', task: 'SIFT/ORB features, epipolar verification, camera poses, SfM pipeline' },
    { role: 'Deep Learning Engineer', task: 'PointNeXt 3D segmentation, dynamic ghost culling, crack detection' },
    { role: '3D & Geospatial Lead', task: 'Dense point clouds, Screened Poisson meshes, UTM georeferencing, scale validation' },
    { role: 'Backend & Pipeline Architect', task: 'FastAPI orchestration, asynchronous job queues, chunked asset delivery' },
    { role: 'Frontend & 3D WebGL Developer', task: 'Interactive Three.js engine, 3D measurement calipers, mission control HUD' },
    { role: 'Integration, Benchmarking & QA', task: 'Dataset calibration, reprojection accuracy testing, SIH evaluation defense' },
  ];

  return (
    <section id="technical-specs" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
            <span className="w-1.5 h-1.5 bg-white" />
            <span>SCIENTIFIC CREDIBILITY // TECHNICAL SPECIFICATIONS</span>
            <StatusBadge status="IMPLEMENTED" size="sm" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
            Engineering <br />
            <span className="text-slate-400">Foundation &amp; Stack</span>
          </h2>

          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm mt-4 font-sans leading-relaxed">
            Every stage of AeroTwin 3D is engineered with rigorous, field-proven open-source photogrammetry,
            geometric computation, and spatial AI libraries.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-12 font-mono">
          {stackItems.map((stk, idx) => (
            <div
              key={idx}
              className="bg-[#05070B] border border-white/15 p-5 hover:border-white/40 transition-all flex flex-col justify-between hud-bracket-container"
            >
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-white font-bold bg-white/10 px-2 py-0.5 border border-white/20">
                    {stk.tag}
                  </span>
                  <span className="text-[9px] text-slate-500">0{idx + 1}</span>
                </div>
                <h3 className="font-display font-bold text-white text-sm uppercase mb-1">
                  {stk.name}
                </h3>
                <div className="text-[10px] text-slate-400 mb-3">{stk.role}</div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {stk.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>INTEGRATION VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Team Division Section */}
        <div className="bg-[#05070B] border border-white/20 p-6 sm:p-8 hud-bracket-container font-mono">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/10 gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-white" />
              <div>
                <h3 className="font-display font-bold text-white text-base uppercase">
                  SIH 6-Person Engineering Squad Division
                </h3>
                <p className="text-[11px] text-slate-400">
                  Targeted allocation for NTRO SIH26158 competition defense.
                </p>
              </div>
            </div>
            <StatusBadge status="IMPLEMENTED" size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {teamRoles.map((r, i) => (
              <div key={i} className="bg-black p-4 border border-white/10 space-y-1">
                <div className="flex justify-between items-center text-slate-500 text-[10px]">
                  <span>MEMBER 0{i + 1}</span>
                  <span>ROLE</span>
                </div>
                <div className="text-white text-xs font-bold uppercase">{r.role}</div>
                <div className="text-slate-400 text-[10px] font-sans pt-1 leading-snug">{r.task}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
