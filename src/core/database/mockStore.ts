import { Party, Product, CashboxBank, JournalEntry, Invoice, AuditLog } from '../types/database.types';
import { INITIAL_PARTIES, INITIAL_PRODUCTS, INITIAL_CASHBOXES, INITIAL_JOURNAL_ENTRIES, INITIAL_INVOICES } from './mockData';

const STORAGE_KEYS = {
  PARTIES: 'erp_parties_v1',
  PRODUCTS: 'erp_products_v1',
  CASHBOXES: 'erp_cashboxes_v1',
  ENTRIES: 'erp_journal_entries_v1',
  INVOICES: 'erp_invoices_v1',
  AUDIT: 'erp_audit_logs_v1',
};

function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export class ERPStore {
  static getParties(): Party[] {
    return getStored(STORAGE_KEYS.PARTIES, INITIAL_PARTIES).filter(p => !p.deleted_at);
  }

  static saveParty(party: Party): Party {
    const parties = this.getParties();
    const index = parties.findIndex(p => p.id === party.id);
    if (index >= 0) parties[index] = { ...party, updated_at: new Date().toISOString() };
    else parties.push(party);
    setStored(STORAGE_KEYS.PARTIES, parties);
    this.addAuditLog('parties', party.id, index >= 0 ? 'UPDATE' : 'INSERT', party);
    return party;
  }

  static getProducts(): Product[] {
    return getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS).filter(p => !p.deleted_at);
  }

  static saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = { ...product, updated_at: new Date().toISOString() };
    else products.push(product);
    setStored(STORAGE_KEYS.PRODUCTS, products);
    this.addAuditLog('products', product.id, index >= 0 ? 'UPDATE' : 'INSERT', product);
    return product;
  }

  static getCashboxes(): CashboxBank[] {
    return getStored(STORAGE_KEYS.CASHBOXES, INITIAL_CASHBOXES).filter(c => !c.deleted_at);
  }

  static getJournalEntries(): JournalEntry[] {
    return getStored(STORAGE_KEYS.ENTRIES, INITIAL_JOURNAL_ENTRIES).filter(e => !e.deleted_at);
  }

  static addJournalEntry(entry: JournalEntry): JournalEntry {
    const entries = this.getJournalEntries();
    entries.unshift(entry);
    setStored(STORAGE_KEYS.ENTRIES, entries);
    this.addAuditLog('journal_entries', entry.id, 'INSERT', entry);
    return entry;
  }

  static getInvoices(): Invoice[] {
    return getStored(STORAGE_KEYS.INVOICES, INITIAL_INVOICES).filter(i => !i.deleted_at);
  }

  static saveInvoice(invoice: Invoice): Invoice {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(i => i.id === invoice.id);
    if (index >= 0) invoices[index] = { ...invoice, updated_at: new Date().toISOString() };
    else invoices.unshift(invoice);
    setStored(STORAGE_KEYS.INVOICES, invoices);
    this.addAuditLog('invoices', invoice.id, index >= 0 ? 'UPDATE' : 'INSERT', invoice);
    return invoice;
  }

  static getAuditLogs(): AuditLog[] {
    return getStored(STORAGE_KEYS.AUDIT, []);
  }

  static addAuditLog(table_name: string, record_id: string, action: 'INSERT' | 'UPDATE' | 'DELETE', new_data?: Record<string, unknown> | object): void {
    const logs = this.getAuditLogs();
    const log: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      table_name,
      record_id,
      action,
      new_data,
      performed_by: 'عبدالرحمن الزعيم',
      created_at: new Date().toISOString()
    };
    logs.unshift(log);
    setStored(STORAGE_KEYS.AUDIT, logs);
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}
