import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, MessageSquare, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { ARCHITECTURE_SERVICES, ArchitectureService } from '../data/services.ts';
import { COMPANY } from '../config/company.ts';
import { ChromaticBox } from './ChromaticBox.tsx';

interface ServiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceForEstimate: (service: ArchitectureService) => void;
  onSelectServiceView: (service: ArchitectureService) => void;
}

export const ServiceSearchModal: React.FC<ServiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceForEstimate,
  onSelectServiceView,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ArchitectureService[]>(ARCHITECTURE_SERVICES.slice(0, 4));
  const [noMatchState, setNoMatchState] = useState<{
    message: string;
    alternatives: ArchitectureService[];
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(ARCHITECTURE_SERVICES.slice(0, 4));
      setNoMatchState(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        });
        const data = await response.json();

        if (data.matched && Array.isArray(data.results) && data.results.length > 0) {
          setResults(data.results);
          setNoMatchState(null);
        } else {
          setNoMatchState({
            message: data.message || `Sorry, we do not currently offer "${query}".`,
            alternatives: data.alternatives || ARCHITECTURE_SERVICES.slice(0, 3),
          });
          setResults([]);
        }
      } catch (err) {
        const lower = query.toLowerCase();
        const localMatches = ARCHITECTURE_SERVICES.filter(
          (s) =>
            s.title.toLowerCase().includes(lower) ||
            s.shortDescription.toLowerCase().includes(lower) ||
            s.keywords.some((k) => k.toLowerCase().includes(lower))
        );
        if (localMatches.length > 0) {
          setResults(localMatches);
          setNoMatchState(null);
        } else {
          setNoMatchState({
            message: `Sorry, we do not currently offer "${query}".`,
            alternatives: ARCHITECTURE_SERVICES.slice(0, 3),
          });
          setResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#0D0F17] rounded-2xl shadow-2xl border border-amber-500/35 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative p-4 sm:p-5 hairline-b border-white/10 flex items-center gap-3 bg-[#131520]">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you need (e.g. 3BHK home design, office interior, nakshaa, elevation, GHMC)..."
            className="w-full text-sm sm:text-base bg-transparent outline-none text-[#F8FAFC] placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 ml-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills with Chromatic Touches */}
        <div className="px-5 py-2.5 bg-[#0A0C13] hairline-b border-white/10 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
          <span className="shrink-0 font-medium text-slate-300">Try searching:</span>
          {['Independent Villa', 'Interior Design', 'GHMC Approval', 'Vastu Layout', 'Elevation Design'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="shrink-0 px-2.5 py-1 bg-[#171926] hover:bg-amber-400 hover:text-black rounded-lg text-[11px] text-slate-200 border border-white/10 transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Body Content */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {isSearching && (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Searching architectural service index &amp; engineering directory...
            </div>
          )}

          {/* When Matching Results Found */}
          {!isSearching && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Matching Architectural Services ({results.length})</span>
                <span className="text-[11px] text-amber-400">Hyderabad Practice</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {results.map((service, sIdx) => (
                  <ChromaticBox
                    key={service.id}
                    preset={sIdx % 2 === 0 ? 'amber' : 'prismatic'}
                    className="p-4 bg-[#141624] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold uppercase tracking-wider mb-1">
                        <span>{service.category}</span>
                        <span className="font-mono">{service.startingPriceRange}</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white group-hover:text-amber-400 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 hairline-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onSelectServiceView(service);
                          onClose();
                        }}
                        className="text-xs text-slate-300 hover:text-white font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          onSelectServiceForEstimate(service);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[11px] uppercase tracking-wider font-bold rounded-lg hover:shadow-md transition-all"
                      >
                        <span>Get Estimate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </ChromaticBox>
                ))}
              </div>
            </div>
          )}

          {/* When NO MATCH: Section 6 Mandatory Behavior */}
          {!isSearching && noMatchState && (
            <div className="space-y-6 py-2">
              <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-500/40 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-300">Service Not Offered</h4>
                  <p className="text-xs text-amber-200 mt-1 leading-relaxed">
                    {noMatchState.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    We specialize strictly in architectural design, structural engineering, interior architecture, and Telangana statutory approvals.
                  </p>
                </div>
              </div>

              {/* 3 Closest Alternatives */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
                  Closest Available Architectural Services:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {noMatchState.alternatives.map((alt) => (
                    <ChromaticBox
                      key={alt.id}
                      preset="amber"
                      className="p-3 bg-[#141624] border border-white/10"
                    >
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider block">
                        {alt.category}
                      </span>
                      <h5 className="font-serif text-sm font-medium text-white mt-0.5">
                        {alt.title}
                      </h5>
                      <button
                        onClick={() => {
                          onSelectServiceForEstimate(alt);
                          onClose();
                        }}
                        className="mt-3 text-[11px] text-amber-400 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </ChromaticBox>
                  ))}
                </div>
              </div>

              {/* Talk to our team */}
              <ChromaticBox preset="cyan" className="p-4 bg-[#141624] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Have a custom architectural inquiry?
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Speak directly with our principal consultant at our Gudimalkapur studio.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${COMPANY.contact.phoneRaw}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-all border border-white/15"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call 087904 55491</span>
                  </a>
                  <a
                    href={`https://wa.me/918790455491?text=Hello%20Ultimate%20Design%2C%20I%20had%20an%20enquiry%20regarding%20architectural%20consultation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </ChromaticBox>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
