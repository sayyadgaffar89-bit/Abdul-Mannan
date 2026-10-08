import React, { useState } from 'react';
import { COMPANY } from '../config/company.ts';
import { InteractiveMapSection } from '../components/InteractiveMapSection.tsx';
import { ARCHITECTURE_SERVICES } from '../data/services.ts';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Star, Calendar, MessageSquare, Sparkles } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Residential Architecture');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.replace(/\D/g, ''),
          email: email.trim(),
          serviceTitle: service,
          message: message.trim(),
          preferredDate,
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
      {/* Header */}
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Connect &amp; Consult
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
            Studio Location &amp; Consultation Booking
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Schedule an in-person meeting at our Santosh Nagar studio in Gudimalkapur or book an architectural site survey across Hyderabad.
          </p>
        </div>
      </CinematicScrollSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Column with Chromatic Box */}
        <div className="lg:col-span-5 space-y-6">
          <ChromaticBox preset="amber" className="p-6 sm:p-8 bg-[#12141D]/90 border border-white/10 space-y-5">
            <h3 className="font-serif text-xl font-medium text-[#F8FAFC]">
              Studio Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{COMPANY.name}</p>
                  <p className="text-slate-300">{COMPANY.address.line1}</p>
                  <p className="text-slate-300">{COMPANY.address.locality}</p>
                  <p className="text-slate-300">{COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.postalCode}</p>
                  <p className="text-[11px] text-amber-400 font-mono mt-1">
                    Plus Code: {COMPANY.address.plusCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 hairline-t border-white/10 pt-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Studio Timings</p>
                  <p className="text-slate-400">{COMPANY.hours.dailySummary} (Monday through Sunday)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 hairline-t border-white/10 pt-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Direct Architectural Line</p>
                  <a
                    href={`tel:${COMPANY.contact.phoneRaw}`}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    {COMPANY.contact.phoneFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 hairline-t border-white/10 pt-3">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">WhatsApp Direct Inquiry</p>
                  <a
                    href={`https://wa.me/918790455491?text=Hello%20Ultimate%20Design%2C%20I%20would%20like%20to%20consult%20regarding%20architectural%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    +91 87904 55491 (Chat with Team)
                  </a>
                </div>
              </div>
            </div>

            {/* Google Rating */}
            <div className="pt-2 hairline-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Google Verified Score:</span>
              <div className="flex items-center gap-1 font-semibold text-white">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 / 5.0 (11 reviews)</span>
              </div>
            </div>
          </ChromaticBox>
        </div>

        {/* Form Column with Chromatic Box */}
        <div className="lg:col-span-7">
          <ChromaticBox preset="prismatic" className="p-6 sm:p-8 bg-[#12141D]/90 border border-amber-500/30">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-amber-400 mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-medium text-[#F8FAFC]">
                  Message &amp; Site Visit Logged
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, {name}. Our structural and architectural consultant has received your message and will telephone +91 {mobile.slice(-10)} shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:scale-105 transition-all"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#F8FAFC] mb-1">
                  Book a Site Visit or Consultation
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Fill out the details below to receive a call back within standard working hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 text-xs bg-[#171926] text-white border border-white/15 rounded-lg outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-slate-400">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-3 py-2 text-xs bg-[#171926] text-white border border-white/15 rounded-lg outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
                      Service Required
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#171926] text-white border border-white/15 rounded-lg outline-none focus:border-amber-400"
                    >
                      {ARCHITECTURE_SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
                      Target Site Visit Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#171926] text-white border border-white/15 rounded-lg outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
                    Plot Dimensions, Road Width or Scope Note
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. 300 sq.yards corner plot in Mehdipatnam, planning G+2 duplex residence..."
                    className="w-full px-3 py-2 text-xs bg-[#171926] text-white border border-white/15 rounded-lg outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-xl shadow-amber-500/25 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting Request...' : 'Transmit Consultation Request'}
                </button>
              </form>
            )}
          </ChromaticBox>
        </div>
      </div>

      {/* Real Map Section with Real Directions */}
      <CinematicScrollSection effect="subtle">
        <InteractiveMapSection />
      </CinematicScrollSection>
    </div>
  );
};
