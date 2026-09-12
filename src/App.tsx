import React, { useState } from 'react';
import { useFlightTelemetry } from './hooks/useFlightTelemetry';
import { CursorMode } from './types/aerial';
import { AerospaceCursor } from './components/common/AerospaceCursor';
import { Navigation } from './components/common/Navigation';
import { HeroSection } from './components/hero/HeroSection';
import { HeroTransformation } from './components/hero/HeroTransformation';
import { ProblemSection } from './components/problem/ProblemSection';
import { SfmVisualizer } from './components/cv-pipeline/SfmVisualizer';
import { SensorFusionConsole } from './components/cv-pipeline/SensorFusionConsole';
import { ViewerSection } from './components/viewer-3d/ViewerSection';
import { AiIntelligence } from './components/ai-layer/AiIntelligence';
import { ApplicationsSection } from './components/applications/ApplicationsSection';
import { PipelineArchitecture } from './components/architecture/PipelineArchitecture';
import { TechnicalCredibility } from './components/tech-specs/TechnicalCredibility';
import { DemoSimulator } from './components/demo/DemoSimulator';
import { FooterSection } from './components/footer/FooterSection';
import { ShortcutsModal } from './components/common/ShortcutsModal';

export const App: React.FC = () => {
  const telemetry = useFlightTelemetry();
  const [cursorMode, setCursorMode] = useState<CursorMode>('DEFAULT');
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);

  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setShortcutsModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShortcutsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-[#E2E8F0] relative selection:bg-white selection:text-black">
      {/* Dynamic Aerospace Reticle Cursor (Desktop Only) */}
      <AerospaceCursor mode={cursorMode} />

      {/* Mission Control Navigation */}
      <Navigation
        telemetry={telemetry}
        onJumpToSection={scrollToSection}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      <main>
        {/* 00: Mission Manifest Hero */}
        <HeroSection
          telemetry={telemetry}
          onExploreClick={() => scrollToSection('transformation')}
          onLaunchViewer={() => scrollToSection('viewer-3d')}
        />

        {/* 01: Multi-Stage Hero Transformation Visualizer */}
        <HeroTransformation />

        {/* 02: The Problem: A Video Is Not A Map */}
        <ProblemSection />

        {/* 03: Structure from Motion (SfM) Multiview Corridor */}
        <SfmVisualizer />

        {/* 04: Sensor Fusion & Georeferencing Telemetry Console */}
        <SensorFusionConsole telemetry={telemetry} />

        {/* 05: 3D Digital Twin Viewer & Spatial Measurement */}
        <ViewerSection />

        {/* 06: Spatial AI Intelligence Layer & Anomaly Detection */}
        <AiIntelligence />

        {/* 07: Strategic Applications & NTRO Mission Profiles */}
        <ApplicationsSection />

        {/* 08: Interactive 16-Stage Reconstruction Architecture */}
        <PipelineArchitecture />

        {/* 09: Technical Credibility & SIH Team Division */}
        <TechnicalCredibility />

        {/* 10: Interactive Ingestion & Reconstruction Demo */}
        <DemoSimulator
          onReconstructComplete={() => scrollToSection('viewer-3d')}
        />
      </main>

      {/* Footer Credentials & SIH26158 Audit */}
      <FooterSection
        onBackToTop={handleBackToTop}
        onJumpToSection={scrollToSection}
      />

      {/* Operator Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
};

export default App;
