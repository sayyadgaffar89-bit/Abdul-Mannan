import React from 'react';
import { COMPANY } from '../config/company.ts';
import { ChromaticBox } from './ChromaticBox.tsx';
import { Compass, Phone, MapPin, Clock, Star, Heart, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacy, onOpenAdmin }) => {
  return (
    <footer className="bg-[#07080B] text-[#F8FAFC] hairline-t border-white/10 pt-16 pb-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 hairline-b border-white/10">
          {/* Col 1: Studio Identity & Trust */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center bg-white/5 text-amber-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl tracking-tight text-[#F8FAFC]">
                Ultimate Design &amp; Consultant
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Architectural planning, structural engineering consultancy, Vastu harmonization, and municipal approvals in Hyderabad, Telangana.
            </p>

            {/* Google Rating Verification with Chromatic Box */}
            <div className="pt-2">
              <ChromaticBox preset="amber" tilt={false} className="p-2.5 bg-[#12141D] inline-block border-white/10">
                <a
                  href={COMPANY.reputation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#F8FAFC] hover:text-amber-400 transition-colors"
                >
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="font-semibold text-white">4.9 on Google</span>
                  <span className="text-slate-400">· 11 verified reviews</span>
                </a>
              </ChromaticBox>
            </div>

            {/* LGBTQ+ Friendly Inclusivity Badge */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>{COMPANY.reputation.inclusivityBadge}</span>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
              Practice Domains
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Residential Architecture &amp; Villas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Structural Planning &amp; RCC Engineering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Architectural Interior Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  GHMC &amp; TS-bPASS Permit Drawings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Vastu-Compliant Master Zoning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('estimator')} className="hover:text-amber-400 transition-colors font-medium text-amber-400/90">
                  → Project Cost Estimator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hyderabad Studio Location & Hours */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
              Studio Location &amp; Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{COMPANY.address.line1}</p>
                  <p className="text-slate-400">{COMPANY.address.locality}</p>
                  <p className="text-slate-400">{COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.postalCode}</p>
                  <p className="text-[11px] text-amber-400 mt-0.5">Plus Code: {COMPANY.address.plusCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{COMPANY.hours.dailySummary} (Mon – Sun)</span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${COMPANY.contact.phoneRaw}`} className="text-white hover:text-amber-400 font-medium">
                  {COMPANY.contact.phoneFormatted} ({COMPANY.contact.phoneInternational})
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar: Legal, DPDP, Admin */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors underline">
              Privacy Policy (DPDP Act 2023)
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Directions &amp; Map
            </button>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Studio Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
