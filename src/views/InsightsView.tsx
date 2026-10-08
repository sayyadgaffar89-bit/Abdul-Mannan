import React, { useState } from 'react';
import { INSIGHT_ARTICLES, InsightArticle } from '../data/insights.ts';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import { ArrowRight, X, Clock, Calendar, User } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Research &amp; Architectural Insights
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
            Articles on Hyderabad Architecture, Vastu &amp; Approvals
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Technical perspectives from our studio on municipal bye-laws, cost engineering, structural sustainability, and contemporary Indian architecture.
          </p>
        </div>
      </CinematicScrollSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INSIGHT_ARTICLES.map((article, aIdx) => (
          <CinematicScrollSection key={article.id} effect="tilt-forward">
            <ChromaticBox
              preset={aIdx % 2 === 0 ? 'amber' : 'prismatic'}
              onClick={() => setSelectedArticle(article)}
              className="cursor-pointer bg-[#12141D]/90 border border-white/10 flex flex-col justify-between h-full"
            >
              <div className="h-48 overflow-hidden bg-black">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono mb-1">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#F8FAFC] group-hover:text-amber-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 hairline-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>{article.date}</span>
                  <span className="font-semibold text-white group-hover:text-amber-400 flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ChromaticBox>
          </CinematicScrollSection>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#12141D] rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-[#0C0E14] text-[#F8FAFC] flex items-center justify-between shrink-0 hairline-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  {selectedArticle.category} · {selectedArticle.readTime}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#F8FAFC] mt-0.5">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="flex items-center gap-4 text-xs text-slate-400 pb-2 hairline-b border-white/10">
                <span>By {selectedArticle.author}</span>
                <span>·</span>
                <span>Published {selectedArticle.date}</span>
              </div>

              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="text-slate-200">
                  {paragraph}
                </p>
              ))}

              <div className="p-4 bg-[#171926] rounded-xl border border-white/10 mt-6 text-xs text-slate-400">
                <p className="font-semibold text-white">Need statutory clearance or structural consultation?</p>
                <p className="mt-1">
                  Contact our Gudimalkapur studio team directly at 087904 55491 for TS-bPASS submissions and drawing preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
