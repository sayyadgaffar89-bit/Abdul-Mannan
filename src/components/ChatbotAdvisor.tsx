import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Maximize2,
  Download,
  Calendar,
  Sparkles,
  AlertTriangle,
  Building,
  Check,
  ChevronDown,
  Layers,
  FileText
} from 'lucide-react';
import { EstimateResult, ProjectType, QualityGrade, HyderabadZone } from '../data/rates.ts';
import { COMPANY } from '../config/company.ts';
import { jsPDF } from 'jspdf';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: string;
  options?: string[];
  estimateData?: EstimateResult;
}

interface ChatbotAdvisorProps {
  preSelectedService?: string | null;
  onOpenConsultationWithData?: (data: any) => void;
}

export const ChatbotAdvisor: React.FC<ChatbotAdvisorProps> = ({
  preSelectedService,
  onOpenConsultationWithData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Extracted project state
  const [projectState, setProjectState] = useState<{
    projectType: ProjectType;
    quality: QualityGrade;
    builtUpAreaSqFt: number;
    floors: number;
    zone: HyderabadZone;
    budgetInr?: number;
    isReadyForEstimate: boolean;
  }>({
    projectType: 'independent_house',
    quality: 'premium',
    builtUpAreaSqFt: 2400,
    floors: 2,
    zone: 'hyderabad_central',
    isReadyForEstimate: false,
  });

  const [currentEstimate, setCurrentEstimate] = useState<EstimateResult | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      role: 'bot',
      content:
        'Namaste! I am the Architectural Planning & Cost Advisor for Ultimate Design and Consultant in Hyderabad. To compute an accurate project cost range and material take-off, what type of project are you planning?',
      timestamp: 'Just now',
      options: [
        'Independent House / Kothi',
        'Luxury Villa',
        'Commercial & Office',
        'Architectural Interior',
        'Structural Renovation',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle pre-selected service if user clicked "Get Estimate" from search or services
  useEffect(() => {
    if (preSelectedService) {
      setIsOpen(true);
      setIsMinimized(false);
      const userMsg: Message = {
        id: 'msg_' + Date.now(),
        role: 'user',
        content: `I would like to plan and estimate for: ${preSelectedService}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: 'msg_bot_' + Date.now(),
          role: 'bot',
          content: `Excellent choice. For ${preSelectedService}, what is the approximate built-up area or plot size you are envisioning in square feet?`,
          timestamp: 'Just now',
          options: ['1,500 sq.ft', '2,400 sq.ft', '3,500 sq.ft', '5,000+ sq.ft'],
        },
      ]);
    }
  }, [preSelectedService]);

  // Pure server calculation trigger
  const fetchEstimate = async (params: {
    projectType: ProjectType;
    quality: QualityGrade;
    builtUpAreaSqFt: number;
    floors?: number;
    zone?: HyderabadZone;
    budgetInr?: number;
  }) => {
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data: EstimateResult = await res.json();
      setCurrentEstimate(data);
      return data;
    } catch (err) {
      console.error('[Estimate Fetch Error]', err);
      return null;
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: 'Just now',
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          currentRequirements: projectState,
        }),
      });

      const data = await response.json();
      const updatedReqs = data.updatedRequirements || projectState;
      setProjectState(updatedReqs);

      let estimateCard: EstimateResult | undefined = undefined;

      // If user indicated enough parameters or asked for cost, calculate estimate
      const shouldCalc =
        updatedReqs.isReadyForEstimate ||
        textToSend.toLowerCase().includes('cost') ||
        textToSend.toLowerCase().includes('estimate') ||
        textToSend.toLowerCase().includes('budget') ||
        textToSend.toLowerCase().includes('sq.ft') ||
        textToSend.toLowerCase().includes('sqft');

      if (shouldCalc) {
        const est = await fetchEstimate({
          projectType: updatedReqs.projectType || 'independent_house',
          quality: updatedReqs.quality || 'premium',
          builtUpAreaSqFt: updatedReqs.builtUpAreaSqFt || 2400,
          floors: updatedReqs.floors || 2,
          zone: updatedReqs.zone || 'hyderabad_central',
          budgetInr: updatedReqs.budgetInr,
        });
        if (est) estimateCard = est;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          role: 'bot',
          content:
            data.reply ||
            'Here is the structured breakdown computed from our verified Hyderabad architectural rate table.',
          timestamp: 'Just now',
          estimateData: estimateCard,
          options: !estimateCard
            ? ['Standard (₹1,850 - ₹2,150/sqft)', 'Premium (₹2,350 - ₹2,850/sqft)', 'Luxury (₹3,100 - ₹4,100/sqft)']
            : ['Schedule Site Visit Consultation', 'Adjust Area / Quality', 'Ask About Vastu Rules'],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_err_' + Date.now(),
          role: 'bot',
          content:
            'We have registered your project requirements. You can also view our full Cost Estimator tab or speak directly with our principal consultant at 087904 55491.',
          timestamp: 'Just now',
          options: ['Schedule Site Visit', 'Call Studio'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOptionClick = (option: string) => {
    // Context-sensitive option selection
    if (option.includes('Independent House')) {
      setProjectState((p) => ({ ...p, projectType: 'independent_house' }));
      handleSendMessage('Planning an Independent House in Hyderabad.');
    } else if (option.includes('Luxury Villa')) {
      setProjectState((p) => ({ ...p, projectType: 'villa' }));
      handleSendMessage('Planning a Luxury Villa project.');
    } else if (option.includes('Commercial')) {
      setProjectState((p) => ({ ...p, projectType: 'commercial' }));
      handleSendMessage('Planning a Commercial building.');
    } else if (option.includes('Interior')) {
      setProjectState((p) => ({ ...p, projectType: 'apartment_interior' }));
      handleSendMessage('Planning an Interior Design project.');
    } else if (option.includes('Renovation')) {
      setProjectState((p) => ({ ...p, projectType: 'renovation' }));
      handleSendMessage('Planning a Structural Renovation & Remodeling.');
    } else if (option.includes('Standard')) {
      setProjectState((p) => ({ ...p, quality: 'standard' }));
      handleSendMessage('I prefer Standard quality specification.');
    } else if (option.includes('Premium')) {
      setProjectState((p) => ({ ...p, quality: 'premium' }));
      handleSendMessage('I prefer Premium quality specification.');
    } else if (option.includes('Luxury')) {
      setProjectState((p) => ({ ...p, quality: 'luxury' }));
      handleSendMessage('I prefer Luxury grade finishes and architectural treatments.');
    } else if (option.includes('Schedule Site Visit')) {
      if (onOpenConsultationWithData) {
        onOpenConsultationWithData({
          projectType: projectState.projectType,
          builtUpArea: `${projectState.builtUpAreaSqFt} sq.ft`,
          estimateSnapshot: currentEstimate,
        });
      }
    } else {
      handleSendMessage(option);
    }
  };

  // Generate Branded PDF Estimate
  const downloadPdfEstimate = (estimate: EstimateResult) => {
    try {
      const doc = new jsPDF();

      // Header Brand
      doc.setFillColor(22, 22, 26);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFont('times', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(246, 243, 238);
      doc.text('ULTIMATE DESIGN AND CONSULTANT', 15, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(176, 141, 87);
      doc.text('Architectural Planning · Structural Engineering · Hyderabad (Tel: 087904 55491)', 15, 26);

      // Meta Info
      doc.setTextColor(22, 22, 26);
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.text('PROJECT ARCHITECTURAL COST ESTIMATE', 15, 45);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${new Intl.DateTimeFormat('en-IN').format(new Date())} | Ref ID: UDC-EST-${Date.now().toString().slice(-6)}`, 15, 52);
      doc.text(`Location: Gudimalkapur / Hyderabad, Telangana`, 15, 57);

      // Summary Box
      doc.setDrawColor(176, 141, 87);
      doc.setFillColor(246, 243, 238);
      doc.roundedRect(15, 63, 180, 34, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setTextColor(22, 22, 26);
      doc.text(`Scope: ${estimate.projectType.replace('_', ' ').toUpperCase()} (${estimate.quality.toUpperCase()} SPECIFICATION)`, 20, 72);
      doc.text(`Built-up Area: ${estimate.builtUpAreaSqFt.toLocaleString('en-IN')} sq.ft`, 20, 78);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(176, 141, 87);
      const minLakh = (estimate.totalCostMin / 100000).toFixed(2);
      const maxLakh = (estimate.totalCostMax / 100000).toFixed(2);
      doc.text(`Estimated Range: Rs. ${minLakh} Lakh to Rs. ${maxLakh} Lakh`, 20, 88);

      // Category breakdown table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(22, 22, 26);
      doc.text('STAGE-WISE & TRADE COST BREAKDOWN (INR)', 15, 108);

      let yPos = 116;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      estimate.categoryBreakdown.slice(0, 8).forEach((cat) => {
        doc.text(cat.name, 15, yPos);
        doc.text(`${cat.percentage}%`, 110, yPos);
        const catAvgLakh = (cat.costAvg / 100000).toFixed(2);
        doc.text(`Rs. ${catAvgLakh} L`, 160, yPos);
        yPos += 7;
      });

      // Material Quantities
      yPos += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('APPROXIMATE MATERIAL QUANTITIES (HYDERABAD STANDARDS)', 15, yPos);

      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      estimate.materialEstimates.slice(0, 5).forEach((mat) => {
        doc.text(`• ${mat.material}:`, 15, yPos);
        doc.text(`${mat.quantity.toLocaleString('en-IN')} ${mat.unit}`, 110, yPos);
        yPos += 6;
      });

      // Statutory Disclaimer (Mandatory Section 7)
      yPos += 8;
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      const disclaimerLines = doc.splitTextToSize(estimate.disclaimer, 180);
      doc.text(disclaimerLines, 15, yPos);

      // Studio Footer
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text('Ultimate Design and Consultant · Flat No. 2, Second Floor, near M.S. Junior College, Santosh Nagar, Gudimalkapur, Hyderabad 500006', 15, 285);

      doc.save(`Ultimate_Design_Estimate_${estimate.builtUpAreaSqFt}sqft.pdf`);
    } catch (e) {
      console.error('[PDF Export Error]', e);
      window.print();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open Architectural Cost Planner"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black rounded-full shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all duration-300 border border-amber-300/60 group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-black" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-black">
            Cost &amp; Project Planner
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          role="region"
          aria-label="Architectural Cost Planner Chatbot"
          className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 w-[calc(100vw-2rem)] sm:w-[460px] bg-[#0E1018] text-[#F8FAFC] rounded-2xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[640px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#141622] text-[#F8FAFC] flex items-center justify-between shrink-0 hairline-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-medium leading-none text-white">
                  Architectural Planner
                </h3>
                <p className="text-[10px] text-amber-400 font-mono mt-1">
                  Hyderabad Benchmark Rate Engine (Oct 2026)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white transition-colors rounded"
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white transition-colors rounded"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#090A0E]/90">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-tr-none shadow-md'
                          : 'bg-[#141624] text-slate-200 border border-white/10 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Structured Estimate Card (Section 7 requirement) */}
                      {msg.estimateData && (
                        <div className="mt-3.5 pt-3 hairline-t border-white/10 space-y-3 bg-[#0A0C14] -mx-1 p-3 rounded-lg border border-amber-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                              Calculated Scope ({msg.estimateData.builtUpAreaSqFt} sq.ft)
                            </span>
                            <span className="text-[10px] font-medium text-slate-300 uppercase">
                              {msg.estimateData.quality} Spec
                            </span>
                          </div>

                          {/* Range in INR */}
                          <div className="p-3 bg-[#131522] rounded-lg border border-amber-500/30">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                              Estimated Budget Range
                            </p>
                            <p className="font-serif text-lg text-amber-400 font-semibold mt-0.5">
                              ₹{(msg.estimateData.totalCostMin / 100000).toFixed(1)} L – ₹
                              {(msg.estimateData.totalCostMax / 100000).toFixed(1)} Lakh
                            </p>
                            <p className="text-[10px] text-slate-400">
                              ₹{msg.estimateData.ratePerSqFtMin} – ₹{msg.estimateData.ratePerSqFtMax} / sq.ft (Civil + Finishes)
                            </p>
                          </div>

                          {/* Category Distribution Bar */}
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                              Trade &amp; Milestone Allocation
                            </p>
                            <div className="space-y-1.5">
                              {msg.estimateData.categoryBreakdown.slice(0, 5).map((cat) => (
                                <div key={cat.name} className="flex flex-col gap-0.5">
                                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                                    <span className="truncate max-w-[170px]">{cat.name}</span>
                                    <span className="font-mono tabular-nums text-amber-400">
                                      ₹{(cat.costAvg / 100000).toFixed(1)} L ({cat.percentage}%)
                                    </span>
                                  </div>
                                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-400 to-pink-500"
                                      style={{ width: `${cat.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Material quantities preview */}
                          <div className="p-2.5 bg-[#141624] rounded-lg border border-white/10 text-[10px]">
                            <p className="font-semibold text-white uppercase tracking-wider mb-1">
                              Key Material Quantities (Estimated):
                            </p>
                            <p className="text-slate-300">
                              • Cement: ~{msg.estimateData.materialEstimates[0]?.quantity} bags · Steel: ~{msg.estimateData.materialEstimates[1]?.quantity.toLocaleString('en-IN')} kg · Bricks: ~{msg.estimateData.materialEstimates[2]?.quantity.toLocaleString('en-IN')} units
                            </p>
                          </div>

                          {/* Budget Warning if applicable */}
                          {msg.estimateData.budgetWarning && (
                            <div className="p-2 bg-amber-950/40 rounded border border-amber-500/40 text-[10px] text-amber-200 flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <p>{msg.estimateData.budgetWarning}</p>
                            </div>
                          )}

                          {/* Mandatory Disclaimer */}
                          <p className="text-[9px] text-slate-400 leading-tight italic">
                            "{msg.estimateData.disclaimer}"
                          </p>

                          {/* Action Buttons */}
                          <div className="pt-1 flex items-center gap-2">
                            <button
                              onClick={() => downloadPdfEstimate(msg.estimateData!)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all"
                            >
                              <Download className="w-3 h-3 text-amber-400" />
                              <span>PDF Estimate</span>
                            </button>
                            <button
                              onClick={() => {
                                if (onOpenConsultationWithData) {
                                  onOpenConsultationWithData({
                                    projectType: msg.estimateData!.projectType,
                                    builtUpArea: `${msg.estimateData!.builtUpAreaSqFt} sq.ft`,
                                    estimateSnapshot: msg.estimateData,
                                  });
                                }
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:scale-[1.02] text-black rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Consultation</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Reply Buttons */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleQuickOptionClick(opt)}
                            className="px-2.5 py-1 bg-[#171926] hover:bg-amber-400 hover:text-black border border-white/15 text-slate-200 rounded-lg text-[10px] transition-all font-semibold"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                    <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Consultant reviewing specifications...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-[#141622] hairline-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type area (e.g. 3000 sq ft), bedroom count, style..."
                    className="flex-1 text-xs py-2 px-3 bg-[#0A0C14] text-white border border-white/15 rounded-lg outline-none focus:border-amber-400 placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-lg hover:scale-105 transition-all disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
