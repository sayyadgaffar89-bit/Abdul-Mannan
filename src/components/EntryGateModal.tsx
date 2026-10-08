import React, { useState, useEffect } from 'react';
import { COMPANY } from '../config/company.ts';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ChromaticBox } from './ChromaticBox.tsx';

interface EntryGateModalProps {
  onPassed: (name: string) => void;
  onOpenPrivacy: () => void;
}

export const EntryGateModal: React.FC<EntryGateModalProps> = ({ onPassed, onOpenPrivacy }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; consent?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  useEffect(() => {
    const input = document.getElementById('entry-full-name');
    if (input) input.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const validate = () => {
    const errs: { name?: string; mobile?: string; consent?: string } = {};
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters).';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
    }

    if (!consent) {
      errs.consent = 'You must agree to the consultation contact terms and Privacy Policy.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    const cleanMobile = mobile.replace(/\D/g, '');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          mobile: cleanMobile,
          consent: true,
          honeypot: honeypot,
          sourcePage: window.location.pathname || 'Homepage Entry Gate',
        }),
      });

      const data = await response.json();
      const visitorName = (data && data.name) || name.trim() || 'Valued Visitor';

      try {
        localStorage.setItem('ud_gate_cleared', 'true');
        localStorage.setItem('ud_lead_name', visitorName);
      } catch (e) {}

      setWelcomeName(visitorName);
      setTimeout(() => {
        onPassed(visitorName);
      }, 1400);
    } catch (err) {
      const fallbackName = name.trim() || 'Visitor';
      try {
        localStorage.setItem('ud_gate_cleared', 'true');
        localStorage.setItem('ud_lead_name', fallbackName);
      } catch {}
      setWelcomeName(fallbackName);
      setTimeout(() => {
        onPassed(fallbackName);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 md:p-8"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0F1118] shadow-2xl border border-amber-500/30 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Visual Column */}
        <div className="relative hidden md:block md:col-span-5 bg-black text-[#F8FAFC] overflow-hidden">
          <img
            src="/src/assets/images/hero_luxury_villa_1791451715925.jpg"
            alt="Architectural Villa by Ultimate Design and Consultant"
            className="absolute inset-0 h-full w-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1118] via-[#0F1118]/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
                Studio Monograph
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light leading-snug tracking-wide text-white">
                Ultimate Design &amp; Consultant
              </h2>
            </div>
            <div className="space-y-4">
              <div className="hairline-t pt-4 border-white/10 text-xs text-slate-400 leading-relaxed">
                <p>Architectural Planning · Civil Structural Engineering · GHMC Approvals · Hyderabad</p>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-amber-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified Studio Practice · 4.9 on Google</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column with Chromatic Radiance Container */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center p-6 sm:p-10 bg-[#0F1118] relative">
          {welcomeName ? (
            <div className="flex flex-col items-center justify-center text-center py-12 transition-all duration-500 animate-fadeIn">
              <CheckCircle2 className="w-14 h-14 text-amber-400 animate-pulse mb-4" />
              <p className="text-xs uppercase tracking-widest text-slate-400">Access Granted</p>
              <h3 className="font-serif text-3xl font-medium text-white mt-2">
                Welcome, {welcomeName}
              </h3>
              <p className="text-sm text-slate-400 mt-3 max-w-sm">
                Opening the studio portfolio and architectural cost estimation suite...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Private Studio Access
                </span>
                <h1 id="entry-title" className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1.5">
                  Welcome to Ultimate Design
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Please provide your name and mobile number to explore our portfolio, interactive cost planner, and architectural services.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <input
                  type="text"
                  name="website_fax_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                />

                {/* Full Name */}
                <div>
                  <label htmlFor="entry-full-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="entry-full-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Syed Mansoor or Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 text-sm bg-[#171926] text-white border ${
                      errors.name ? 'border-red-500' : 'border-white/15 focus:border-amber-400'
                    } rounded-lg outline-none transition-colors placeholder:text-slate-500`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="entry-mobile-number" className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                    Mobile Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-semibold text-slate-400 pointer-events-none">
                      +91
                    </span>
                    <input
                      id="entry-mobile-number"
                      type="tel"
                      required
                      autoComplete="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(digits);
                        if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
                      }}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 text-sm bg-[#171926] text-white border ${
                        errors.mobile ? 'border-red-500' : 'border-white/15 focus:border-amber-400'
                      } rounded-lg outline-none transition-colors placeholder:text-slate-500`}
                    />
                  </div>
                  {errors.mobile ? (
                    <p className="mt-1 text-xs text-red-400">{errors.mobile}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-400">
                      10-digit Indian mobile number for direct consultation follow-up.
                    </p>
                  )}
                </div>

                {/* DPDP Act 2023 Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#171926] text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to be contacted by {COMPANY.name} regarding architectural consultation and accept the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenPrivacy();
                        }}
                        className="text-amber-400 underline hover:text-amber-300 transition-colors"
                      >
                        Privacy Policy
                      </button>
                      {' '}(India DPDP Act 2023 compliant).
                    </span>
                  </label>
                  {errors.consent && <p className="mt-1 text-xs text-red-400">{errors.consent}</p>}
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs uppercase tracking-widest font-bold rounded-lg shadow-xl shadow-amber-500/25 hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Verifying Access...
                      </span>
                    ) : (
                      <>
                        <span>Enter Studio Experience</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 hairline-t border-white/10 text-center">
                <p className="text-[11px] text-slate-400">
                  Address: {COMPANY.address.locality}, Hyderabad · Tel: {COMPANY.contact.phoneFormatted}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
