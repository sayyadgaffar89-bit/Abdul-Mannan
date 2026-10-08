import React, { useState } from 'react';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface Stage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string;
  image: string;
}

export const SketchToStructure: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages: Stage[] = [
    {
      number: '01',
      title: 'Conceptual Sketch & Spatial Zoning',
      subtitle: 'The Initial Ideation',
      description:
        'Translating site contours, solar path, and lifestyle narratives into hand-drawn architectural massing sketches and circulation diagrams.',
      deliverables: 'Bubble diagrams, sight-line studies, preliminary massing models',
      image: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
    },
    {
      number: '02',
      title: 'Vastu Alignment & Floor Plans',
      subtitle: 'Precision Geometry',
      description:
        'Refining proportions using the Ashta Dikpalaka grid, ensuring natural cross-ventilation, functional room flow, and GHMC setback compliance.',
      deliverables: 'Dimensioned CAD floor plans, structural column grids, municipal zoning check',
      image: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
    },
    {
      number: '03',
      title: '3D Photorealistic Visualization',
      subtitle: 'Atmospheric Materiality',
      description:
        'Simulating Hyderabad sun angles, bespoke lighting temperatures, travertine textures, and glass reflections in physically based 4K renders.',
      deliverables: 'Exterior street elevations, 360° virtual walkthroughs, material schedules',
      image: '/src/assets/images/hero_luxury_villa_1791451715925.jpg',
    },
    {
      number: '04',
      title: 'Structural Detailing & Built Reality',
      subtitle: 'The Good-For-Construction Reality',
      description:
        'Engineering every beam, column, and foundation footing with STAAD.Pro analysis and issuing comprehensive GFC drawings for flawless on-site execution.',
      deliverables: 'Bar bending schedules (BBS), MEP services coordination, periodic quality audits',
      image: '/src/assets/images/project_residence_jubilee_1791451774514.jpg',
    },
  ];

  const currentStage = stages[activeStageIndex];

  return (
    <section className="py-20 sm:py-28 bg-[#16161A] text-[#F6F3EE] relative overflow-hidden blueprint-grid-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 hairline-b border-white/10 pb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B08D57]">
              Evolution of Form · 01
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#F6F3EE] mt-2">
              From Sketch to Structure
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8C8A85] max-w-md leading-relaxed">
            Every landmark begins with an abstract line. Experience our four-stage design methodology that turns client vision into structural reality.
          </p>
        </div>

        {/* Interactive Progress Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
          {stages.map((st, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={st.number}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-4 text-left rounded-lg transition-all border ${
                  isActive
                    ? 'bg-white/10 border-[#B08D57] shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#B08D57] mb-1 font-mono">
                  <span>{st.number}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] animate-ping" />}
                </div>
                <h4 className="font-serif text-sm sm:text-base font-medium text-[#F6F3EE] truncate">
                  {st.title}
                </h4>
                <p className="text-[11px] text-[#8C8A85] mt-1 hidden sm:block truncate">
                  {st.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Pinned Showcase Stage Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-xs">
          {/* Visual Showcase */}
          <div className="lg:col-span-7 relative h-[340px] sm:h-[460px] rounded-xl overflow-hidden border border-white/10">
            <img
              key={currentStage.image}
              src={currentStage.image}
              alt={currentStage.title}
              className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] via-transparent to-transparent opacity-80" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-[#16161A]/80 backdrop-blur-md rounded border border-white/10 text-[11px] font-mono text-[#B08D57]">
              Phase {currentStage.number} of 04
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#8C8A85]">
              <span>Architectural Rigor</span>
              <span>Gudimalkapur, Hyderabad Studio</span>
            </div>
          </div>

          {/* Descriptive Context */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B08D57] font-semibold">
                Phase {currentStage.number} Overview
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F6F3EE] mt-1">
                {currentStage.title}
              </h3>
              <p className="text-xs text-[#B08D57] mt-1 font-medium">{currentStage.subtitle}</p>
            </div>

            <p className="text-sm text-[#8C8A85] leading-relaxed">
              {currentStage.description}
            </p>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#B08D57] font-semibold block">
                Primary Deliverables
              </span>
              <p className="text-xs text-[#F6F3EE] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                <span>{currentStage.deliverables}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() =>
                  setActiveStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : 0))
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B08D57] text-[#16161A] text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-[#C9A86C] transition-colors"
              >
                <span>{activeStageIndex === stages.length - 1 ? 'Restart Journey' : 'Next Stage'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
