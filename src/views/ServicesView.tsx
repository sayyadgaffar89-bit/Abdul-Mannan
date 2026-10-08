import React, { useState } from 'react';
import { ARCHITECTURE_SERVICES, ArchitectureService } from '../data/services.ts';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import { ArrowRight, CheckCircle2, ChevronRight, X, Clock, Layers, IndianRupee, Sparkles } from 'lucide-react';

interface ServicesViewProps {
  onOpenConsultation: (data?: any) => void;
  selectedServiceModal: ArchitectureService | null;
  setSelectedServiceModal: (service: ArchitectureService | null) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onOpenConsultation,
  selectedServiceModal,
  setSelectedServiceModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Architectural', 'Engineering', 'Interiors', 'Statutory & Management'];

  const filteredServices = activeCategory === 'All'
    ? ARCHITECTURE_SERVICES
    : ARCHITECTURE_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
      {/* Header */}
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Comprehensive Architectural Directory
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
            Services &amp; Engineering Disciplines
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            From early conceptual massing and scientific Vastu orientation to STAAD structural design, GHMC permissions, and high-end interior architecture.
          </p>
        </div>
      </CinematicScrollSection>

      {/* Interactive Category Filter Tabs (Zero-Pill Discipline: Segmented Controls) */}
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

      {/* Services Grid with Interactive Colorful Touch Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, idx) => (
          <CinematicScrollSection key={service.id} effect="subtle">
            <ChromaticBox
              preset={idx % 3 === 0 ? 'amber' : idx % 3 === 1 ? 'cyan' : 'fuchsia'}
              className="bg-[#12141D]/90 border border-white/10 flex flex-col justify-between h-full"
            >
              <div className="relative h-48 overflow-hidden bg-black">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-mono text-amber-400 border border-white/10">
                  {service.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#F8FAFC] group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="space-y-3 pt-3 hairline-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Timeline:</span>
                    <span className="font-medium text-white">{service.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Benchmark Rate:</span>
                    <span className="font-medium text-amber-400 font-mono">{service.startingPriceRange}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedServiceModal(service)}
                      className="text-xs text-slate-300 hover:text-white font-semibold"
                    >
                      View Deliverables
                    </button>
                    <button
                      onClick={() => onOpenConsultation({ serviceTitle: service.title })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-md text-xs font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                    >
                      <span>Get Estimate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </ChromaticBox>
          </CinematicScrollSection>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedServiceModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#12141D] rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-[#0C0E14] text-[#F8FAFC] flex items-center justify-between shrink-0 hairline-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  {selectedServiceModal.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#F8FAFC] mt-0.5">
                  {selectedServiceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#F8FAFC]">
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-1.5">
                  Service Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedServiceModal.fullDescription}
                </p>
              </div>

              {/* Deliverables with Chromatic Touches */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  What is Included &amp; Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedServiceModal.deliverables.map((item) => (
                    <div
                      key={item}
                      className="p-2.5 bg-[#171926] rounded-lg border border-white/10 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methodology */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  Execution Methodology &amp; Milestones
                </h4>
                <div className="space-y-1.5">
                  {selectedServiceModal.process.map((step, sIdx) => (
                    <div
                      key={step}
                      className="p-2 bg-[#171926] rounded-lg border border-white/10 flex items-center gap-2.5 text-xs text-slate-200"
                    >
                      <span className="font-mono text-amber-400 font-semibold">0{sIdx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Timeline Meta */}
              <div className="p-4 bg-[#171926] rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Indicative Benchmark:</p>
                  <p className="font-semibold text-sm text-amber-400 font-mono">
                    {selectedServiceModal.startingPriceRange}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Standard Turnaround:</p>
                  <p className="font-semibold text-sm text-white">
                    {selectedServiceModal.timeline}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onOpenConsultation({ serviceTitle: selectedServiceModal.title });
                    setSelectedServiceModal(null);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
