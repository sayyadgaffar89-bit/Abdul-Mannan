import React from 'react';
import { COMPANY } from '../config/company.ts';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import { Compass, ShieldCheck, Star, Award, CheckCircle2, Phone, MapPin } from 'lucide-react';

interface AboutViewProps {
  onOpenConsultation: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenConsultation }) => {
  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
      {/* Studio Header */}
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Studio Philosophy &amp; Practice
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F8FAFC] tracking-tight">
            Quiet Confidence, Disciplined Engineering.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {COMPANY.name} is an architectural design and civil engineering consultancy studio located in Gudimalkapur, Hyderabad. We believe exceptional buildings emerge from the seamless synthesis of spatial poetry and structural rigor.
          </p>
        </div>
      </CinematicScrollSection>

      {/* Split Story Section */}
      <CinematicScrollSection effect="tilt-forward">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#F8FAFC]">
              Rooted in Hyderabad's Evolving Urban Fabric
            </h2>
            <p>
              Based near M.S. Junior College in Santosh Nagar, Gudimalkapur, our studio is deeply conversant with local geotechnical conditions, Telangana climatic cycles, and the regulatory nuances of GHMC, HMDA, and TS-bPASS.
            </p>
            <p>
              We reject superficial ornamentation in favor of architectural quiet luxury—spaces organized around natural light, cross-ventilation, authentic materials (natural stone, warm timber, acoustic textures), and scientific Vastu Shastra alignments.
            </p>

            <ChromaticBox preset="amber" className="p-4 bg-[#141624]/90 border border-amber-500/30 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Verified Google Reputation
              </span>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-white text-xs">4.9 / 5.0 Rating</span>
                <span className="text-slate-400 text-xs">· 11 authentic reviews on Google Maps</span>
              </div>
            </ChromaticBox>
          </div>

          <div className="lg:col-span-6 relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-black">
            <img
              src="/src/assets/images/hero_luxury_villa_1791451715925.jpg"
              alt="Studio Architectural Perspective"
              className="w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </CinematicScrollSection>

      {/* Leadership & Credentials with Chromatic Boxes */}
      <CinematicScrollSection effect="depth-zoom">
        <ChromaticBox preset="prismatic" className="p-8 sm:p-12 bg-[#12141D]/90 border border-white/10 space-y-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Consultancy Practice &amp; Governance
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#F8FAFC] mt-1">
              Studio Accreditations &amp; Registrations
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              All professional statutory numbers verified for Telangana practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ChromaticBox preset="cyan" className="p-5 bg-[#171926]/80 border border-white/10 space-y-2">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h4 className="font-serif text-base font-semibold text-white">Council of Architecture</h4>
              <p className="text-xs text-slate-300">
                Registration No: <code className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-amber-400 border border-white/10">{COMPANY.placeholders.coaRegistrationNumber}</code>
              </p>
              <p className="text-[11px] text-slate-400">Empanelled architectural practitioner.</p>
            </ChromaticBox>

            <ChromaticBox preset="amber" className="p-5 bg-[#171926]/80 border border-white/10 space-y-2">
              <Award className="w-6 h-6 text-amber-400" />
              <h4 className="font-serif text-base font-semibold text-white">GHMC / TS-bPASS Licensed</h4>
              <p className="text-xs text-slate-300">
                Licence ID: <code className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-amber-400 border border-white/10">{COMPANY.placeholders.ghmcEmpanelmentNo}</code>
              </p>
              <p className="text-[11px] text-slate-400">Municipal sanctions across Hyderabad limits.</p>
            </ChromaticBox>

            <ChromaticBox preset="emerald" className="p-5 bg-[#171926]/80 border border-white/10 space-y-2">
              <Compass className="w-6 h-6 text-emerald-400" />
              <h4 className="font-serif text-base font-semibold text-white">Structural Safety Certification</h4>
              <p className="text-xs text-slate-300">
                Standards: <span className="font-mono text-emerald-400">IS 456 / IS 1893</span>
              </p>
              <p className="text-[11px] text-slate-400">Earthquake resistant RCC design verification.</p>
            </ChromaticBox>
          </div>

          <div className="pt-4 hairline-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Studio: {COMPANY.address.fullFormatted}</span>
            </div>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 hover:scale-105 transition-all"
            >
              Meet the Principal Consultant
            </button>
          </div>
        </ChromaticBox>
      </CinematicScrollSection>
    </div>
  );
};
