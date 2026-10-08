import React, { useState } from 'react';
import { COMPANY } from '../config/company.ts';
import { ARCHITECTURE_SERVICES, ArchitectureService } from '../data/services.ts';
import { ARCHITECTURE_PROJECTS, Project } from '../data/projects.ts';
import { SketchToStructure } from '../components/SketchToStructure.tsx';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider.tsx';
import { InteractiveMapSection } from '../components/InteractiveMapSection.tsx';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import {
  Star,
  ArrowRight,
  Search,
  Compass,
  CheckCircle,
  Building,
  Sparkles,
  Phone,
  Shield,
  Layers,
  ChevronRight,
  Sparkle
} from 'lucide-react';

interface HomeViewProps {
  onOpenSearch: () => void;
  onOpenConsultation: (data?: any) => void;
  onSelectService: (service: ArchitectureService) => void;
  onSelectProject: (project: Project) => void;
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenSearch,
  onOpenConsultation,
  onSelectService,
  onSelectProject,
  onNavigate,
}) => {
  return (
    <div className="space-y-24 sm:space-y-36 pb-28 relative z-10">
      {/* 1. Hero Section: 3D Visual Scroll Animation with Depth */}
      <CinematicScrollSection effect="depth-zoom">
        <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden blueprint-grid-dark">
          {/* Subtle Ambient Radial Gradients */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-amber-500/15 via-fuchsia-500/10 to-cyan-500/10 blur-[130px] rounded-full" />
            <img
              src="/src/assets/images/hero_luxury_villa_1791451715925.jpg"
              alt="Contemporary Architecture by Ultimate Design and Consultant"
              className="w-full h-full object-cover object-center opacity-30 scale-105 filter saturate-90 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090A0E]/85 via-[#090A0E]/75 to-[#090A0E]" />
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            {/* Studio Category Badge Box */}
            <div className="inline-block">
              <ChromaticBox preset="amber" tilt={false} className="px-4 py-1.5 rounded-full inline-flex items-center gap-2.5 bg-[#171924]/80 border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
                <span className="font-semibold tracking-wider uppercase text-[11px] text-amber-400">
                  Hyderabad Studio Practice
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-300 font-medium">{COMPANY.address.locality}</span>
              </ChromaticBox>
            </div>

            {/* Marquee Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#F8FAFC] max-w-4xl mx-auto leading-[1.08] text-balance drop-shadow-sm">
                Where Precision Engineering Meets Architectural Quiet Luxury.
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Bespoke residential architecture, structural design, Vastu-compliant layouts, and municipal approvals in Hyderabad, crafted with uncompromising spatial rigor.
              </p>
            </div>

            {/* Section 6: Prominent Search Engine with Interactive Colorful Touch Box */}
            <div className="max-w-2xl mx-auto pt-2">
              <ChromaticBox
                preset="prismatic"
                onClick={onOpenSearch}
                className="cursor-pointer p-2 rounded-2xl bg-[#141620]/90 border border-white/15 hover:border-amber-400/60 transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className="pl-3 text-amber-400">
                    <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    placeholder="Describe what you need (e.g. 3BHK home design, office interior, nakshaa, elevation, GHMC)..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-transparent outline-none text-[#F8FAFC] placeholder:text-slate-400 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all shrink-0"
                  >
                    Explore Services
                  </button>
                </div>
              </ChromaticBox>
              <p className="text-[11px] text-slate-400 mt-2.5 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Natural language enabled · Instant pricing benchmarks · 15 specialized domains</span>
              </p>
            </div>

            {/* Trust Marker Bar with Interactive Touch Boxes */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-xs">
              <ChromaticBox preset="amber" className="p-3 bg-[#13151F]/70 border-white/10">
                <a
                  href={COMPANY.reputation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9 on Google</span>
                  <span className="text-slate-400">(11 reviews)</span>
                </a>
              </ChromaticBox>

              <ChromaticBox preset="cyan" className="p-3 bg-[#13151F]/70 border-white/10">
                <div className="flex items-center justify-center gap-2 text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium text-white">TS-bPASS / GHMC Licensed</span>
                </div>
              </ChromaticBox>

              <ChromaticBox preset="emerald" className="p-3 bg-[#13151F]/70 border-white/10">
                <div className="flex items-center justify-center gap-2 text-slate-200">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium text-white">Scientific Vastu Shastra</span>
                </div>
              </ChromaticBox>
            </div>
          </div>
        </section>
      </CinematicScrollSection>

      {/* 2. Featured Architectural Services Grid with Interactive Colorful Touch Boxes */}
      <CinematicScrollSection effect="tilt-forward">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 hairline-b border-white/10 pb-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                Practice Areas · 02
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F8FAFC] mt-1">
                Architectural &amp; Structural Disciplines
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-amber-400 hover:text-white transition-colors"
            >
              <span>View All 15 Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARCHITECTURE_SERVICES.slice(0, 6).map((service, idx) => (
              <ChromaticBox
                key={service.id}
                preset={idx % 2 === 0 ? 'amber' : 'prismatic'}
                className="bg-[#12141D]/90 border border-white/10 flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-black">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-mono text-amber-400 border border-white/10">
                    0{idx + 1} · {service.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#F8FAFC] group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 hairline-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-amber-400/90 font-mono">
                      {service.startingPriceRange}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectService(service)}
                        className="text-xs text-slate-300 hover:text-white font-medium"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onOpenConsultation({ serviceTitle: service.title })}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-md text-[11px] font-semibold hover:bg-amber-400 hover:text-black transition-all"
                      >
                        <span>Estimate</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </ChromaticBox>
            ))}
          </div>
        </section>
      </CinematicScrollSection>

      {/* 3. Pinned "From Sketch to Structure" Storytelling Sequence */}
      <CinematicScrollSection effect="subtle">
        <SketchToStructure />
      </CinematicScrollSection>

      {/* 4. Featured Projects Gallery with Interactive Touch Boxes */}
      <CinematicScrollSection effect="depth-zoom">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 hairline-b border-white/10 pb-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                Curated Portfolio · 03
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F8FAFC] mt-1">
                Select Architectural Works
              </h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-amber-400 hover:text-white transition-colors"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ARCHITECTURE_PROJECTS.slice(0, 2).map((project, pIdx) => (
              <ChromaticBox
                key={project.id}
                preset={pIdx === 0 ? 'prismatic' : 'amber'}
                onClick={() => onSelectProject(project)}
                className="cursor-pointer bg-[#12141D]/90 border border-white/10 hover:border-amber-400/50 overflow-hidden"
              >
                <div className="relative h-72 sm:h-96 overflow-hidden bg-black">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/85 backdrop-blur-md rounded-md text-xs text-[#F8FAFC] font-mono border border-white/10">
                    {project.category} · {project.location}
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold uppercase rounded-md shadow-lg">
                    {project.builtUpArea}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">
                    {project.scope}
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-[#F8FAFC] group-hover:text-amber-400 transition-colors mt-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="mt-4 pt-4 hairline-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] italic">{project.isPlaceholderNotice}</span>
                    <span className="font-semibold text-white group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </ChromaticBox>
            ))}
          </div>
        </section>
      </CinematicScrollSection>

      {/* 5. Before & After Renovation Slider */}
      <CinematicScrollSection effect="tilt-forward">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BeforeAfterSlider
            beforeImage="/src/assets/images/sketch_to_structure_1791451751179.jpg"
            afterImage="/src/assets/images/project_residence_jubilee_1791451774514.jpg"
            title="Structural Remodeling & Elevation Transformation"
            description="Drag to inspect how our engineering intervention preserved foundational columns while creating modern, daylit volumes."
          />
        </section>
      </CinematicScrollSection>

      {/* 6. Real Verified Google Reviews with Interactive Colorful Touch Boxes */}
      <CinematicScrollSection effect="depth-zoom">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              Client Testimonials · 04
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F8FAFC] mt-1">
              Verified Client Endorsements
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-white">{COMPANY.reputation.ratingLabel}</span>
              <span>· Real Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPANY.testimonials.map((review, rIdx) => (
              <ChromaticBox
                key={review.id}
                preset={rIdx === 0 ? 'amber' : rIdx === 1 ? 'cyan' : 'prismatic'}
                className="p-6 bg-[#131520]/80 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Verified on Google
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="pt-4 mt-4 hairline-t border-white/10">
                  <p className="font-serif text-sm font-semibold text-[#F8FAFC]">{review.name}</p>
                  <p className="text-[11px] text-slate-400">{review.role}</p>
                </div>
              </ChromaticBox>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href={COMPANY.reputation.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-white transition-colors"
            >
              <span>Read All 11 Verified Google Reviews on Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </CinematicScrollSection>

      {/* 7. Real Map Section with Real Directions */}
      <CinematicScrollSection effect="subtle">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveMapSection />
        </section>
      </CinematicScrollSection>

      {/* 8. Studio Consultation CTA Band with Chromatic Box Radiance */}
      <CinematicScrollSection effect="depth-zoom">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChromaticBox preset="prismatic" className="p-8 sm:p-14 bg-[#141622]/90 border border-amber-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-3 text-center md:text-left">
                <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
                  Ready to Build?
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F8FAFC]">
                  Schedule an In-Studio Consultation or Site Visit
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Meet our principal architects at our Gudimalkapur studio or schedule an on-site property evaluation anywhere across Hyderabad and Telangana.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  onClick={() => onOpenConsultation()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs uppercase font-bold tracking-wider rounded-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-all"
                >
                  Book Site Consultation
                </button>
                <a
                  href={`tel:${COMPANY.contact.phoneRaw}`}
                  className="px-6 py-3 bg-white/10 text-white text-xs uppercase font-semibold tracking-wider rounded-lg hover:bg-white/20 transition-all inline-flex items-center gap-2 border border-white/15"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call 087904 55491</span>
                </a>
              </div>
            </div>
          </ChromaticBox>
        </section>
      </CinematicScrollSection>
    </div>
  );
};
