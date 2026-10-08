import React, { useState } from 'react';
import { ARCHITECTURE_PROJECTS, Project } from '../data/projects.ts';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import { X, ArrowRight, MapPin, Maximize2, Layers } from 'lucide-react';

interface ProjectsViewProps {
  onOpenConsultation: (data?: any) => void;
  selectedProjectModal: Project | null;
  setSelectedProjectModal: (project: Project | null) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenConsultation,
  selectedProjectModal,
  setSelectedProjectModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Residential', 'Commercial', 'Interior', 'Renovation'];

  const filtered = activeCategory === 'All'
    ? ARCHITECTURE_PROJECTS
    : ARCHITECTURE_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
      {/* Header */}
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Monograph Case Studies
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
            Curated Architectural Portfolio
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Exploring spatial proportion, material honesty, daylight choreography, and structural integrity across Hyderabad and South India.
          </p>
        </div>
      </CinematicScrollSection>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#141622]/90 rounded-xl max-w-fit overflow-x-auto border border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid with Interactive Colorful Touch Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((proj, pIdx) => (
          <CinematicScrollSection key={proj.id} effect="tilt-forward">
            <ChromaticBox
              preset={pIdx % 2 === 0 ? 'amber' : 'prismatic'}
              onClick={() => setSelectedProjectModal(proj)}
              className="cursor-pointer bg-[#12141D]/90 border border-white/10 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-72 sm:h-96 overflow-hidden bg-black">
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/85 backdrop-blur-md rounded-md text-xs text-[#F8FAFC] font-mono border border-white/10">
                  {proj.category} · {proj.location}
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold uppercase rounded-md shadow-lg">
                  {proj.builtUpArea}
                </div>
              </div>

              <div className="p-6">
                <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">
                  {proj.scope}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#F8FAFC] group-hover:text-amber-400 transition-colors mt-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {proj.summary}
                </p>

                <div className="mt-4 pt-4 hairline-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] italic">{proj.isPlaceholderNotice}</span>
                  <span className="font-semibold text-white group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                    <span>View Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ChromaticBox>
          </CinematicScrollSection>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProjectModal(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#12141D] rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 bg-[#0C0E14] text-[#F8FAFC] flex items-center justify-between shrink-0 hairline-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  {selectedProjectModal.category} · {selectedProjectModal.location}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#F8FAFC] mt-0.5">
                  {selectedProjectModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#F8FAFC]">
              <div className="h-72 sm:h-96 rounded-xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={selectedProjectModal.coverImage}
                  alt={selectedProjectModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Scope & Challenge / Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#171926] rounded-xl border border-white/10 space-y-1.5">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-amber-400">
                    The Architectural Challenge
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProjectModal.challenge}
                  </p>
                </div>
                <div className="p-4 bg-[#171926] rounded-xl border border-white/10 space-y-1.5">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-amber-400">
                    The Engineered Solution
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProjectModal.solution}
                  </p>
                </div>
              </div>

              {/* Gallery Strip */}
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-amber-400 mb-2">
                  Drawings &amp; Visual Perspectives
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedProjectModal.galleryImages.map((img, i) => (
                    <div key={i} className="h-28 rounded-lg overflow-hidden border border-white/10 bg-black">
                      <img
                        src={img}
                        alt="Project viewpoint"
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 hairline-t border-white/10 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 italic">
                  {selectedProjectModal.isPlaceholderNotice}
                </p>
                <button
                  onClick={() => {
                    onOpenConsultation({
                      projectType: selectedProjectModal.category,
                      builtUpArea: selectedProjectModal.builtUpArea,
                    });
                    setSelectedProjectModal(null);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Request Similar Project Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
