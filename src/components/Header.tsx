import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Phone, Compass, Sparkles } from 'lucide-react';
import { COMPANY } from '../config/company.ts';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onOpenConsultation,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'estimator', label: 'Cost Estimator' },
    { id: 'about', label: 'Studio' },
    { id: 'process', label: 'Process' },
    { id: 'contact', label: 'Contact & Map' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090A0E]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/60 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="group flex items-center gap-3 text-left text-decoration-none"
        >
          <div className="relative w-9 h-9 rounded-full border border-amber-500/40 flex items-center justify-center bg-[#13141C] text-amber-400 shrink-0 shadow-lg group-hover:border-amber-400 group-hover:shadow-amber-500/30 transition-all duration-300">
            <Compass className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
            <span className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping opacity-30 pointer-events-none" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-[#F8FAFC] group-hover:text-amber-400 transition-colors whitespace-nowrap">
            Ultimate Design &amp; Consultant
          </span>
        </a>

        {/* Zone 2: Navigation Links (Clean unboxed text with chromatic hover radiance) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative py-1.5 px-2.5 rounded-md transition-all whitespace-nowrap group hover:text-white ${
                  isActive ? 'text-amber-400 font-bold bg-white/5' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {isActive ? (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 shadow-sm shadow-amber-400/50" />
                ) : (
                  <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Quick search button with radiant hover */}
          <button
            onClick={onOpenSearch}
            aria-label="Search architectural services"
            className="p-2.5 text-slate-300 hover:text-amber-400 transition-all rounded-full hover:bg-white/10 hover:shadow-lg hover:shadow-amber-500/20"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Consultation CTA with Chromatic Radiance border */}
          <button
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex relative group items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-200 whitespace-nowrap"
          >
            <span>Book Consultation</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-2 lg:hidden text-slate-300 hover:text-amber-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#0E1017]/95 backdrop-blur-2xl border-b border-white/15 shadow-2xl px-6 py-6 transition-all duration-300">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm uppercase tracking-wider py-2 px-3 rounded-lg transition-colors ${
                  currentTab === link.id
                    ? 'text-amber-400 font-bold bg-white/5'
                    : 'text-slate-300 hover:text-amber-400 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 hairline-t flex flex-col gap-3">
              <button
                onClick={() => {
                  onOpenConsultation();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-lg shadow-lg shadow-amber-500/25"
              >
                Book a Consultation
              </button>
              <a
                href={`tel:${COMPANY.contact.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-300 border border-white/15 rounded-lg hover:border-amber-400/50"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {COMPANY.contact.phoneFormatted}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
