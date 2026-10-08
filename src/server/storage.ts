import fs from 'fs';
import path from 'path';
import { HYDERABAD_RATE_MASTER, RateTableConfig } from '../data/rates.ts';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const RATES_FILE = path.join(DATA_DIR, 'rates.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface StoredLead {
  id: string;
  name: string;
  mobile: string;
  createdAt: string;
  istTimestamp: string;
  sourcePage: string;
  consent: boolean;
  consentTimestamp: string;
  whatsappStatus: 'sent' | 'pending' | 'failed' | 'simulated_sent';
  whatsappRetries: number;
  whatsappError?: string;
  contacted: boolean;
  notes?: string;
  ipAddress?: string;
}

export interface StoredEnquiry {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  serviceId?: string;
  serviceTitle?: string;
  projectType?: string;
  builtUpArea?: string;
  message?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  estimateSnapshot?: any;
  createdAt: string;
  istTimestamp: string;
  status: 'new' | 'contacted' | 'site_visit_scheduled' | 'closed';
  notes?: string;
}

export interface AnalyticsRecord {
  totalLeads: number;
  totalEnquiries: number;
  searchQueries: { term: string; count: number; matched: boolean; lastSearched: string }[];
  botCompletions: number;
}

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function safeWriteJson<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export const Storage = {
  getLeads(): StoredLead[] {
    return safeReadJson<StoredLead[]>(LEADS_FILE, []);
  },

  addLead(lead: StoredLead): void {
    const leads = this.getLeads();
    leads.unshift(lead);
    safeWriteJson(LEADS_FILE, leads);
    this.recordAnalyticsLead();
  },

  updateLead(id: string, updates: Partial<StoredLead>): StoredLead | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;
    leads[index] = { ...leads[index], ...updates };
    safeWriteJson(LEADS_FILE, leads);
    return leads[index];
  },

  deleteLeadByMobile(mobile: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter((l) => l.mobile !== mobile);
    const deleted = filtered.length !== leads.length;
    if (deleted) {
      safeWriteJson(LEADS_FILE, filtered);
    }
    return deleted;
  },

  getEnquiries(): StoredEnquiry[] {
    return safeReadJson<StoredEnquiry[]>(ENQUIRIES_FILE, []);
  },

  addEnquiry(enquiry: StoredEnquiry): void {
    const list = this.getEnquiries();
    list.unshift(enquiry);
    safeWriteJson(ENQUIRIES_FILE, list);
    this.recordAnalyticsEnquiry();
  },

  updateEnquiry(id: string, updates: Partial<StoredEnquiry>): StoredEnquiry | null {
    const list = this.getEnquiries();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    safeWriteJson(ENQUIRIES_FILE, list);
    return list[index];
  },

  getRateTable(): RateTableConfig {
    return safeReadJson<RateTableConfig>(RATES_FILE, HYDERABAD_RATE_MASTER);
  },

  saveRateTable(rates: RateTableConfig): void {
    safeWriteJson(RATES_FILE, rates);
  },

  resetRateTable(): RateTableConfig {
    safeWriteJson(RATES_FILE, HYDERABAD_RATE_MASTER);
    return HYDERABAD_RATE_MASTER;
  },

  recordSearch(term: string, matched: boolean): void {
    const analytics = safeReadJson<AnalyticsRecord>(ANALYTICS_FILE, {
      totalLeads: 0,
      totalEnquiries: 0,
      searchQueries: [],
      botCompletions: 0,
    });
    const normalized = term.trim().toLowerCase();
    if (!normalized) return;

    const existing = analytics.searchQueries.find((q) => q.term === normalized);
    if (existing) {
      existing.count += 1;
      existing.lastSearched = new Date().toISOString();
      existing.matched = matched;
    } else {
      analytics.searchQueries.push({
        term: normalized,
        count: 1,
        matched,
        lastSearched: new Date().toISOString(),
      });
    }
    safeWriteJson(ANALYTICS_FILE, analytics);
  },

  recordAnalyticsLead(): void {
    const analytics = safeReadJson<AnalyticsRecord>(ANALYTICS_FILE, {
      totalLeads: 0,
      totalEnquiries: 0,
      searchQueries: [],
      botCompletions: 0,
    });
    analytics.totalLeads += 1;
    safeWriteJson(ANALYTICS_FILE, analytics);
  },

  recordAnalyticsEnquiry(): void {
    const analytics = safeReadJson<AnalyticsRecord>(ANALYTICS_FILE, {
      totalLeads: 0,
      totalEnquiries: 0,
      searchQueries: [],
      botCompletions: 0,
    });
    analytics.totalEnquiries += 1;
    safeWriteJson(ANALYTICS_FILE, analytics);
  },

  recordBotCompletion(): void {
    const analytics = safeReadJson<AnalyticsRecord>(ANALYTICS_FILE, {
      totalLeads: 0,
      totalEnquiries: 0,
      searchQueries: [],
      botCompletions: 0,
    });
    analytics.botCompletions += 1;
    safeWriteJson(ANALYTICS_FILE, analytics);
  },

  getAnalytics(): AnalyticsRecord {
    return safeReadJson<AnalyticsRecord>(ANALYTICS_FILE, {
      totalLeads: this.getLeads().length,
      totalEnquiries: this.getEnquiries().length,
      searchQueries: [],
      botCompletions: 0,
    });
  },
};
