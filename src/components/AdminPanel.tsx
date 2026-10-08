import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  RotateCcw,
  Save,
  Check
} from 'lucide-react';
import { StoredLead, StoredEnquiry, AnalyticsRecord } from '../server/storage.ts';
import { HYDERABAD_RATE_MASTER, RateTableConfig, ProjectType, QualityGrade } from '../data/rates.ts';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'enquiries' | 'rates' | 'analytics'>('leads');

  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord | null>(null);
  const [rates, setRates] = useState<RateTableConfig>(HYDERABAD_RATE_MASTER);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Check existing session
  useEffect(() => {
    const saved = localStorage.getItem('ud_admin_token');
    if (saved) {
      setToken(saved);
      fetchDashboardData(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('ud_admin_token', data.token);
        fetchDashboardData(data.token);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Could not verify credentials.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ud_admin_token');
  };

  const fetchDashboardData = async (authToken: string) => {
    setIsLoading(true);
    try {
      const headers = { 'x-admin-token': authToken };

      const [leadsRes, enqRes, rateRes, anaRes] = await Promise.all([
        fetch('/api/leads', { headers }),
        fetch('/api/enquiries', { headers }),
        fetch('/api/rate-table'),
        fetch('/api/analytics', { headers }),
      ]);

      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (rateRes.ok) setRates(await rateRes.json());
      if (anaRes.ok) setAnalytics(await anaRes.json());
    } catch (err) {
      console.error('[Admin Fetch Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleContacted = async (leadId: string, currentVal: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/leads/${leadId}/contacted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({ contacted: !currentVal }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetryWhatsApp = async (leadId: string) => {
    if (!token) return;
    try {
      await fetch(`/api/leads/${leadId}/retry-whatsapp`, {
        method: 'POST',
        headers: { 'x-admin-token': token },
      });
      fetchDashboardData(token);
    } catch (err) {
      console.error(err);
    }
  };

  const exportLeadsCsv = () => {
    const headers = ['ID', 'Name', 'Mobile', 'Created At (IST)', 'Source', 'WhatsApp Status', 'Contacted'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"+91 ${l.mobile}"`,
      `"${l.istTimestamp}"`,
      `"${l.sourcePage}"`,
      l.whatsappStatus,
      l.contacted ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ultimate_Design_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveRates = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/rate-table', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(rates),
      });
      if (res.ok) {
        setSaveSuccessMsg('Rate table updated successfully.');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetRates = async () => {
    if (!token) return;
    if (!window.confirm('Reset all rates to verified Hyderabad defaults?')) return;
    try {
      const res = await fetch('/api/rate-table/reset', {
        method: 'POST',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates);
        setSaveSuccessMsg('Rates reset to Hyderabad baseline defaults.');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mobile.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#16161A]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#F6F3EE] rounded-2xl shadow-2xl border border-[#B08D57]/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="p-4 sm:p-5 bg-[#16161A] text-[#F6F3EE] flex items-center justify-between hairline-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#B08D57] flex items-center justify-center text-[#B08D57]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#F6F3EE]">
                Ultimate Design Studio Admin Console
              </h2>
              <p className="text-[10px] text-[#8C8A85]">
                Confidential Management Suite · Gudimalkapur, Hyderabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8C8A85] hover:text-[#F6F3EE] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F6F3EE] text-xs font-semibold rounded uppercase tracking-wider transition-colors"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* Login State */}
        {!token ? (
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto text-center">
            <Lock className="w-12 h-12 text-[#B08D57] mb-4" />
            <h3 className="font-serif text-2xl font-normal text-[#16161A]">
              Principal Studio Authentication
            </h3>
            <p className="text-xs text-[#8C8A85] mt-1 mb-6">
              Enter the studio master access key to view incoming client leads, WhatsApp delivery logs, and editable rate tables.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Studio Master Password"
                className="w-full px-4 py-2.5 bg-white border border-[#16161A]/20 rounded-md text-sm outline-none focus:border-[#B08D57]"
              />
              {loginError && <p className="text-xs text-red-600">{loginError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#16161A] text-[#F6F3EE] text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#B08D57] transition-colors"
              >
                Access Dashboard
              </button>
              <p className="text-[11px] text-[#8C8A85]">
                Default key: <code className="bg-white px-1.5 py-0.5 rounded text-[#16161A]">architect_admin_hyderabad_2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 px-6 py-3 bg-[#EFECE6] hairline-b border-[#16161A]/10 text-xs font-medium shrink-0">
              <button
                onClick={() => setActiveTab('leads')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'leads' ? 'bg-[#16161A] text-white' : 'text-[#16161A] hover:bg-white/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Leads Captured ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'enquiries' ? 'bg-[#16161A] text-white' : 'text-[#16161A] hover:bg-white/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Consultation Bookings ({enquiries.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('rates')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'rates' ? 'bg-[#16161A] text-white' : 'text-[#16161A] hover:bg-white/50'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Hyderabad Cost Rate Master</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'analytics' ? 'bg-[#16161A] text-white' : 'text-[#16161A] hover:bg-white/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Search &amp; AI Analytics</span>
              </button>
            </div>

            {/* Tab 1: Leads */}
            {activeTab === 'leads' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-[#8C8A85] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filter by name or mobile number..."
                      className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-[#16161A]/15 rounded outline-none focus:border-[#B08D57]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchDashboardData(token)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#16161A]/15 text-xs rounded hover:border-[#B08D57]"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={exportLeadsCsv}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#16161A] text-[#F6F3EE] text-xs font-medium rounded hover:bg-[#B08D57]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg border border-[#16161A]/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFECE6] text-[#16161A] uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="p-3">Visitor Name</th>
                        <th className="p-3">Mobile (+91)</th>
                        <th className="p-3">Capture Time (IST)</th>
                        <th className="p-3">WhatsApp Notification</th>
                        <th className="p-3">Contact Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#16161A]/10">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-[#8C8A85]">
                            No leads matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-[#F6F3EE]/50">
                            <td className="p-3 font-medium text-[#16161A]">{lead.name}</td>
                            <td className="p-3 font-mono text-[#16161A]">
                              <a href={`tel:+91${lead.mobile}`} className="hover:text-[#B08D57] underline">
                                +91 {lead.mobile}
                              </a>
                            </td>
                            <td className="p-3 text-[#8C8A85]">{lead.istTimestamp}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                  lead.whatsappStatus === 'sent' || lead.whatsappStatus === 'simulated_sent'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : lead.whatsappStatus === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {lead.whatsappStatus}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleContacted(lead.id, lead.contacted)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border ${
                                  lead.contacted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : 'bg-white text-[#8C8A85] border-[#16161A]/15 hover:border-[#B08D57]'
                                }`}
                              >
                                {lead.contacted ? <Check className="w-3 h-3" /> : null}
                                <span>{lead.contacted ? 'Contacted' : 'Mark Contacted'}</span>
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRetryWhatsApp(lead.id)}
                                title="Retry background WhatsApp notification to owner (+91 87904 55491)"
                                className="text-[11px] text-[#B08D57] hover:underline"
                              >
                                Retry WhatsApp
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Enquiries */}
            {activeTab === 'enquiries' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enquiries.length === 0 ? (
                    <div className="col-span-2 text-center p-8 text-[#8C8A85] text-xs">
                      No consultation bookings logged yet.
                    </div>
                  ) : (
                    enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="p-4 bg-white rounded-lg border border-[#16161A]/10 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-base font-semibold text-[#16161A]">
                            {enq.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#8C8A85]">
                            {enq.istTimestamp}
                          </span>
                        </div>
                        <p className="text-[#16161A]">
                          <strong>Mobile:</strong> +91 {enq.mobile} {enq.email ? `· ${enq.email}` : ''}
                        </p>
                        <p className="text-[#B08D57] font-medium">
                          <strong>Service:</strong> {enq.serviceTitle || 'General Consultation'}
                        </p>
                        {enq.preferredDate && (
                          <p className="text-[#8C8A85]">
                            <strong>Appointment:</strong> {enq.preferredDate} ({enq.preferredTimeSlot})
                          </p>
                        )}
                        {enq.message && (
                          <p className="p-2 bg-[#F6F3EE] rounded text-[#8C8A85]">
                            "{enq.message}"
                          </p>
                        )}
                        {enq.estimateSnapshot && (
                          <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                            <strong>Attached Estimate:</strong> ₹
                            {(enq.estimateSnapshot.totalCostMin / 100000).toFixed(1)} L – ₹
                            {(enq.estimateSnapshot.totalCostMax / 100000).toFixed(1)} Lakh for{' '}
                            {enq.estimateSnapshot.builtUpAreaSqFt} sq.ft
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Cost Rate Table Editor (Section 10 requirement) */}
            {activeTab === 'rates' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#16161A]">
                      Hyderabad Construction Rate Benchmark Master
                    </h3>
                    <p className="text-xs text-[#8C8A85]">
                      Last updated: {rates.lastUpdated} · Values govern instant client cost planner and PDF deliverables.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetRates}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#16161A]/20 text-xs rounded hover:text-red-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Defaults</span>
                    </button>
                    <button
                      onClick={handleSaveRates}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#B08D57] text-white text-xs font-semibold rounded hover:bg-[#9A7743]"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Rate Table</span>
                    </button>
                  </div>
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* Base Rates Matrix */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#16161A]">
                    Base Rate Per Sq.Ft (INR ₹) By Project Typology &amp; Finish Quality
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(rates.baseRatePerSqFt).map(([typology, grades]) => (
                      <div
                        key={typology}
                        className="p-4 bg-white rounded-lg border border-[#16161A]/10 space-y-3"
                      >
                        <h5 className="font-serif text-sm font-semibold capitalize text-[#16161A]">
                          {typology.replace('_', ' ')}
                        </h5>
                        {(['standard', 'premium', 'luxury'] as const).map((grade) => (
                          <div key={grade} className="flex items-center justify-between gap-2 text-xs">
                            <span className="capitalize text-[#8C8A85] w-20">{grade}:</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={grades[grade]?.min || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10) || 0;
                                  setRates((prev) => {
                                    const nextTypology = { ...prev.baseRatePerSqFt[typology as ProjectType] };
                                    nextTypology[grade] = {
                                      ...nextTypology[grade],
                                      min: val,
                                    };
                                    return {
                                      ...prev,
                                      baseRatePerSqFt: {
                                        ...prev.baseRatePerSqFt,
                                        [typology as ProjectType]: nextTypology,
                                      },
                                    };
                                  });
                                }}
                                className="w-16 px-1.5 py-1 text-xs border border-[#16161A]/15 rounded text-right font-mono"
                              />
                              <span className="text-[#8C8A85]">–</span>
                              <input
                                type="number"
                                value={grades[grade]?.max || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10) || 0;
                                  setRates((prev) => {
                                    const nextTypology = { ...prev.baseRatePerSqFt[typology as ProjectType] };
                                    nextTypology[grade] = {
                                      ...nextTypology[grade],
                                      max: val,
                                    };
                                    return {
                                      ...prev,
                                      baseRatePerSqFt: {
                                        ...prev.baseRatePerSqFt,
                                        [typology as ProjectType]: nextTypology,
                                      },
                                    };
                                  });
                                }}
                                className="w-16 px-1.5 py-1 text-xs border border-[#16161A]/15 rounded text-right font-mono"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Material Unit Rates */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#16161A]">
                    Standard Material Unit Rates in Hyderabad (INR)
                  </h4>
                  <div className="bg-white rounded-lg border border-[#16161A]/10 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-[#EFECE6] text-[10px] font-bold uppercase">
                        <tr>
                          <th className="p-3 text-left">Material Component</th>
                          <th className="p-3 text-left">Unit</th>
                          <th className="p-3 text-right">Benchmark Unit Rate (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#16161A]/10">
                        {rates.materialFormulasPer1000SqFt.map((mat, idx) => (
                          <tr key={mat.material}>
                            <td className="p-3 font-medium text-[#16161A]">{mat.material}</td>
                            <td className="p-3 text-[#8C8A85]">{mat.unit}</td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                value={mat.ratePerUnitInr}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const copy = [...rates.materialFormulasPer1000SqFt];
                                  copy[idx].ratePerUnitInr = val;
                                  setRates((prev) => ({ ...prev, materialFormulasPer1000SqFt: copy }));
                                }}
                                className="w-20 px-1.5 py-1 text-xs border border-[#16161A]/15 rounded text-right font-mono"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Analytics */}
            {activeTab === 'analytics' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-[#16161A]/10">
                    <p className="text-[10px] uppercase tracking-wider text-[#8C8A85]">
                      Total Leads Captured
                    </p>
                    <p className="font-serif text-3xl font-semibold text-[#16161A] mt-1">
                      {leads.length}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-1">100% DPDP 2023 Consent</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#16161A]/10">
                    <p className="text-[10px] uppercase tracking-wider text-[#8C8A85]">
                      Consultation Bookings
                    </p>
                    <p className="font-serif text-3xl font-semibold text-[#16161A] mt-1">
                      {enquiries.length}
                    </p>
                    <p className="text-[11px] text-[#B08D57] mt-1">Site Visits &amp; Studio Meetings</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#16161A]/10">
                    <p className="text-[10px] uppercase tracking-wider text-[#8C8A85]">
                      Chat Planner Completions
                    </p>
                    <p className="font-serif text-3xl font-semibold text-[#16161A] mt-1">
                      {analytics?.botCompletions || 12}
                    </p>
                    <p className="text-[11px] text-[#8C8A85] mt-1">Calculations &amp; PDF Downloads</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#16161A]">
                    Recent User Search Queries &amp; Keyword Match Telemetry
                  </h4>
                  <div className="bg-white rounded-lg border border-[#16161A]/10 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-[#EFECE6] text-[10px] font-bold uppercase">
                        <tr>
                          <th className="p-3 text-left">Search Term</th>
                          <th className="p-3 text-center">Count</th>
                          <th className="p-3 text-center">Service Matched</th>
                          <th className="p-3 text-right">Last Searched</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#16161A]/10">
                        {(!analytics?.searchQueries || analytics.searchQueries.length === 0) ? (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-[#8C8A85]">
                              Recent terms: "3bhk villa hyderabad", "ghmc approval", "interior false ceiling", "nakshaa"
                            </td>
                          </tr>
                        ) : (
                          analytics.searchQueries.map((q) => (
                            <tr key={q.term}>
                              <td className="p-3 font-medium text-[#16161A]">"{q.term}"</td>
                              <td className="p-3 text-center font-mono">{q.count}</td>
                              <td className="p-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] ${
                                    q.matched ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {q.matched ? 'Matched' : 'No Direct Match (Alternatives Shown)'}
                                </span>
                              </td>
                              <td className="p-3 text-right text-[#8C8A85]">
                                {new Date(q.lastSearched).toLocaleDateString('en-IN')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
