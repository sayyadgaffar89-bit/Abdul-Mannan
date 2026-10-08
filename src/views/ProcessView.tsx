import React from 'react';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import { ArrowRight, CheckCircle2, Compass, Layers, ShieldCheck } from 'lucide-react';

interface ProcessViewProps {
  onOpenConsultation: () => void;
}

export const ProcessView: React.FC<ProcessViewProps> = ({ onOpenConsultation }) => {
  const steps = [
    {
      num: '01',
      title: 'Discovery, Contour & Brief Synthesis',
      description: 'Site survey inspection in Hyderabad, soil assessment review, municipal zoning check, and detailed family lifestyle or business brief mapping.',
      deliverables: 'Site analysis report, zoning perimeter study, bubble matrix',
    },
    {
      num: '02',
      title: 'Conceptual Massing & Vastu Alignment',
      description: 'Translating orientations into solar-responsive forms and aligning functional spaces with Ashta Dikpalaka energy quadrants.',
      deliverables: 'Hand-drawn sketches, massing studies, primary floor plans',
    },
    {
      num: '03',
      title: '3D Photorealistic Architectural Visualization',
      description: 'Physical material mapping, daylight simulation, and cinematic 4K walkthroughs to experience exterior facades and interiors before construction.',
      deliverables: 'Day & dusk 3D renders, material mood boards, exterior elevations',
    },
    {
      num: '04',
      title: 'Statutory GHMC & TS-bPASS Approvals',
      description: 'Preparation of auto-DCR municipal drawings adhering strictly to Hyderabad building bye-laws, setbacks, and parking requirements.',
      deliverables: 'Municipal sanction blueprints, TS-bPASS submission file, NOC checklist',
    },
    {
      num: '05',
      title: 'Structural STAAD Analysis & GFC Working Drawings',
      description: 'Rigorous RCC framing calculations according to IS codes, bar bending schedules (BBS), and full plumbing/electrical coordination sets.',
      deliverables: 'Foundation plans, column reinforcement drawings, slab beam details',
    },
    {
      num: '06',
      title: 'Site Quality Supervision & Handover Quality Sign-off',
      description: 'Periodic architectural site audits during key concrete pours, contractor billing verification, snag list audits, and final completion.',
      deliverables: 'Site observation logs, concrete pour approvals, as-built records',
    },
  ];

  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Design Methodology
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
            The Six-Stage Architectural Lifecycle
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            How we guide clients from an empty plot or older building into an engineered, enduring architectural statement in Hyderabad.
          </p>
        </div>
      </CinematicScrollSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((st, sIdx) => (
          <CinematicScrollSection key={st.num} effect="tilt-forward">
            <ChromaticBox
              preset={sIdx % 2 === 0 ? 'amber' : 'prismatic'}
              className="p-6 bg-[#12141D]/90 border border-white/10 flex flex-col justify-between h-full space-y-4"
            >
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 block mb-2">
                  Phase {st.num}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#F8FAFC]">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="pt-4 hairline-t border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Key Deliverables:
                </span>
                <p className="text-xs text-amber-300 font-medium">
                  {st.deliverables}
                </p>
              </div>
            </ChromaticBox>
          </CinematicScrollSection>
        ))}
      </div>

      <CinematicScrollSection effect="depth-zoom">
        <ChromaticBox preset="prismatic" className="p-8 sm:p-12 bg-[#141624]/90 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-light text-[#F8FAFC]">
              Commence Phase 01 with Our Engineering Team
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Complimentary preliminary site coordinate and zoning review.
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-xl shadow-amber-500/25 hover:scale-105 transition-all shrink-0"
          >
            Book Initial Consultation
          </button>
        </ChromaticBox>
      </CinematicScrollSection>
    </div>
  );
};
