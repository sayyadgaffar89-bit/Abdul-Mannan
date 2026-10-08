import React, { useState, useEffect } from 'react';
import {
  ProjectType,
  QualityGrade,
  HyderabadZone,
  calculateProjectEstimate,
  EstimateResult
} from '../data/rates.ts';
import { COMPANY } from '../config/company.ts';
import { ChromaticBox } from '../components/ChromaticBox.tsx';
import { CinematicScrollSection } from '../components/CinematicScrollJourney.tsx';
import {
  Download,
  Calendar,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface EstimatorViewProps {
  onOpenConsultation: (data?: any) => void;
}

export const EstimatorView: React.FC<EstimatorViewProps> = ({ onOpenConsultation }) => {
  const [projectType, setProjectType] = useState<ProjectType>('independent_house');
  const [quality, setQuality] = useState<QualityGrade>('premium');
  const [builtUpArea, setBuiltUpArea] = useState<number>(2400);
  const [floors, setFloors] = useState<number>(2);
  const [zone, setZone] = useState<HyderabadZone>('hyderabad_central');
  const [budgetInr, setBudgetInr] = useState<number>(0);

  const [estimate, setEstimate] = useState<EstimateResult>(() =>
    calculateProjectEstimate({
      projectType: 'independent_house',
      quality: 'premium',
      builtUpAreaSqFt: 2400,
      floors: 2,
      zone: 'hyderabad_central',
    })
  );

  useEffect(() => {
    const res = calculateProjectEstimate({
      projectType,
      quality,
      builtUpAreaSqFt: builtUpArea,
      floors,
      zone,
      budgetInr: budgetInr > 0 ? budgetInr : undefined,
    });
    setEstimate(res);
  }, [projectType, quality, builtUpArea, floors, zone, budgetInr]);

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 17, 23);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(248, 250, 252);
      doc.text('ULTIMATE DESIGN AND CONSULTANT', 15, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(245, 158, 11);
      doc.text('Architectural Planning & Structural Engineering · Hyderabad (087904 55491)', 15, 26);

      doc.setTextColor(22, 22, 26);
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.text('FULL-SCOPE ARCHITECTURAL & CONSTRUCTION ESTIMATE', 15, 45);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Intl.DateTimeFormat('en-IN').format(new Date())} | Benchmark Rates: October 2026`, 15, 52);

      doc.setDrawColor(245, 158, 11);
      doc.setFillColor(246, 243, 238);
      doc.roundedRect(15, 60, 180, 36, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setTextColor(22, 22, 26);
      doc.text(`Typology: ${estimate.projectType.replace('_', ' ').toUpperCase()} (${estimate.quality.toUpperCase()} GRADE)`, 20, 70);
      doc.text(`Built-up Area: ${estimate.builtUpAreaSqFt.toLocaleString('en-IN')} sq.ft (Zone: ${zone.replace('_', ' ').toUpperCase()})`, 20, 77);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(217, 119, 6);
      const minL = (estimate.totalCostMin / 100000).toFixed(2);
      const maxL = (estimate.totalCostMax / 100000).toFixed(2);
      doc.text(`Estimated Range: Rs. ${minL} Lakh to Rs. ${maxL} Lakh (INR)`, 20, 88);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(22, 22, 26);
      doc.text('TRADE & STAGE ALLOCATION', 15, 110);

      let yPos = 118;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      estimate.categoryBreakdown.forEach((cat) => {
        doc.text(cat.name, 15, yPos);
        doc.text(`${cat.percentage}%`, 115, yPos);
        doc.text(`Rs. ${(cat.costAvg / 100000).toFixed(2)} Lakh`, 160, yPos);
        yPos += 7;
      });

      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ESTIMATED MATERIAL VOLUMES (HYDERABAD STANDARDS)', 15, yPos);

      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      estimate.materialEstimates.forEach((m) => {
        doc.text(`• ${m.material}:`, 15, yPos);
        doc.text(`${m.quantity.toLocaleString('en-IN')} ${m.unit}`, 115, yPos);
        yPos += 6;
      });

      yPos += 6;
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      const lines = doc.splitTextToSize(estimate.disclaimer, 180);
      doc.text(lines, 15, yPos);

      doc.save(`Ultimate_Design_${projectType}_${builtUpArea}sqft_Estimate.pdf`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  return (
    <div className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
      {/* Header */}
      <CinematicScrollSection effect="depth-zoom">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Verified Hyderabad Benchmark Engine
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
            Project Cost &amp; Requirements Planner
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Configure your architectural typology, area, and finish grade to compute live Hyderabad construction cost ranges, trade schedules, and material quantities.
          </p>
        </div>
      </CinematicScrollSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls Column */}
        <div className="lg:col-span-5">
          <ChromaticBox preset="amber" className="p-6 sm:p-8 bg-[#12141D]/90 border border-white/10 space-y-6">
            <h3 className="font-serif text-xl font-medium text-[#F8FAFC]">
              01. Project Parameters
            </h3>

            {/* Typology */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Project Typology
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'independent_house', label: 'Independent House' },
                  { id: 'villa', label: 'Luxury Villa' },
                  { id: 'commercial', label: 'Commercial Studio' },
                  { id: 'apartment_interior', label: 'Interior Fitout' },
                  { id: 'renovation', label: 'Structural Remodel' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setProjectType(t.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      projectType === t.id
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#171926] text-slate-300 border-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-200">
                  Built-Up Area (Sq.Ft)
                </span>
                <span className="font-mono font-bold text-sm text-amber-400">
                  {builtUpArea.toLocaleString('en-IN')} sq.ft
                </span>
              </div>
              <input
                type="range"
                min={600}
                max={15000}
                step={100}
                value={builtUpArea}
                onChange={(e) => setBuiltUpArea(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>600 sq.ft</span>
                <span>5,000 sq.ft</span>
                <span>15,000 sq.ft</span>
              </div>
            </div>

            {/* Quality Specification */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Finish &amp; Structural Specification
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'standard', label: 'Standard', desc: 'Vitrified, UPVC' },
                  { id: 'premium', label: 'Premium', desc: 'Teak, Granite' },
                  { id: 'luxury', label: 'Luxury', desc: 'Italian Marble' },
                ].map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      quality === q.id
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400 font-bold shadow-sm shadow-amber-400/20'
                        : 'bg-[#171926] text-slate-300 border-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    <p className="font-semibold capitalize">{q.label}</p>
                    <p className="text-[10px] opacity-75 mt-0.5 truncate">{q.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hyderabad Zone Multiplier */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2">
                Hyderabad Region / Locality
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-[#171926] text-slate-200 border border-white/15 rounded-lg outline-none focus:border-amber-400"
              >
                <option value="hyderabad_central">Hyderabad Central (Gudimalkapur, Mehdipatnam, Banjara Hills)</option>
                <option value="hyderabad_west">Hyderabad West Prime (Jubilee Hills, Financial District, Hitec City)</option>
                <option value="hyderabad_suburbs">Hyderabad Developing Suburbs (Tellapur, Shamshabad, Kompally)</option>
                <option value="telangana_tier2">Telangana Tier-2 (Warangal, Karimnagar, Nizamabad)</option>
              </select>
            </div>

            {/* Optional Budget */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1">
                Target Budget (Optional, in INR)
              </label>
              <input
                type="number"
                placeholder="e.g. 7500000 (for ₹75 Lakh)"
                value={budgetInr > 0 ? budgetInr : ''}
                onChange={(e) => setBudgetInr(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 text-xs bg-[#171926] text-slate-200 border border-white/15 rounded-lg outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
            </div>
          </ChromaticBox>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Estimated Budget Banner with Chromatic Radiance */}
          <ChromaticBox preset="prismatic" className="p-6 sm:p-8 bg-[#141624]/90 border border-amber-500/40 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                Calculated Estimate Range
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {estimate.builtUpAreaSqFt.toLocaleString('en-IN')} sq.ft · {estimate.quality} spec
              </span>
            </div>

            <div className="mt-3">
              <p className="font-serif text-3xl sm:text-5xl font-light text-[#F8FAFC] tracking-tight">
                ₹{(estimate.totalCostMin / 100000).toFixed(1)} Lakh – ₹
                {(estimate.totalCostMax / 100000).toFixed(1)} Lakh
              </p>
              <p className="text-xs text-slate-300 mt-2">
                Benchmark rate: ₹{estimate.ratePerSqFtMin} – ₹{estimate.ratePerSqFtMax} per square foot (Civil structure, MEP, &amp; Finishes).
              </p>
            </div>

            {/* Budget Warning */}
            {estimate.budgetWarning && (
              <div className="mt-4 p-3 bg-amber-950/50 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>{estimate.budgetWarning}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg border border-white/15 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Branded PDF</span>
              </button>
              <button
                onClick={() =>
                  onOpenConsultation({
                    projectType: estimate.projectType,
                    builtUpArea: `${estimate.builtUpAreaSqFt} sq.ft`,
                    estimateSnapshot: estimate,
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Site Consultation</span>
              </button>
            </div>
          </ChromaticBox>

          {/* Trade Allocation Breakdown with Chromatic Box */}
          <ChromaticBox preset="cyan" className="p-6 bg-[#12141D]/90 border border-white/10 space-y-4">
            <h4 className="font-serif text-xl font-medium text-[#F8FAFC]">
              02. Stage-Wise &amp; Trade Cost Allocation
            </h4>
            <div className="space-y-3">
              {estimate.categoryBreakdown.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{cat.name}</span>
                    <span className="font-mono text-amber-400">
                      ₹{(cat.costAvg / 100000).toFixed(1)} Lakh ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChromaticBox>

          {/* Material Quantities Table with Chromatic Box */}
          <ChromaticBox preset="emerald" className="p-6 bg-[#12141D]/90 border border-white/10 space-y-4">
            <h4 className="font-serif text-xl font-medium text-[#F8FAFC]">
              03. Key Material Quantities (Estimates)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#171926] uppercase text-[10px] font-bold text-amber-400">
                  <tr>
                    <th className="p-2.5">Material Component</th>
                    <th className="p-2.5">Estimated Volume</th>
                    <th className="p-2.5 text-right">Approx. Component Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  {estimate.materialEstimates.map((mat) => (
                    <tr key={mat.material} className="hover:bg-white/5 transition-colors">
                      <td className="p-2.5 font-medium text-white">{mat.material}</td>
                      <td className="p-2.5 text-slate-400">
                        {mat.quantity.toLocaleString('en-IN')} {mat.unit}
                      </td>
                      <td className="p-2.5 text-right font-mono font-medium text-amber-400">
                        ₹{(mat.estimatedCost / 100000).toFixed(2)} Lakh
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChromaticBox>

          {/* Disclaimer */}
          <p className="text-xs text-slate-400 leading-relaxed italic bg-[#12141D]/60 p-4 rounded-xl border border-white/10">
            "{estimate.disclaimer}"
          </p>
        </div>
      </div>
    </div>
  );
};
