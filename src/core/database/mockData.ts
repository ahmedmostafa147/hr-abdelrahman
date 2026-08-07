import { Account, Party, Product, CashboxBank, JournalEntry, Invoice } from '../types/database.types';
import { DEFAULT_ACCOUNT_IDS } from '../constants/accounts';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: DEFAULT_ACCOUNT_IDS.CASH, code: '1010', name_ar: 'الخزينة الرئيسية', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.BANK, code: '1020', name_ar: 'الحساب البنكي الرئيسي', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.RECEIVABLE, code: '1100', name_ar: 'حسابات العملاء (مدينون)', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.INVENTORY, code: '1200', name_ar: 'حساب المخزون', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.PAYABLE, code: '2100', name_ar: 'حسابات الموردين (دائنون)', type: 'LIABILITY', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.CAPITAL, code: '3100', name_ar: 'رأس المال وحقوق الملكية', type: 'EQUITY', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.SALES_REVENUE, code: '4100', name_ar: 'إيرادات المبيعات', type: 'REVENUE', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.COGS, code: '5100', name_ar: 'تكلفة البضاعة المباعة', type: 'EXPENSE', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES, code: '6100', name_ar: 'مصروفات تشغيلية وعامة', type: 'EXPENSE', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_PARTIES: Party[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_CASHBOXES: CashboxBank[] = [
  { id: 'cb1', name: 'الخزينة الرئيسية', type: 'CASH', balance_account_id: DEFAULT_ACCOUNT_IDS.CASH, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cb2', name: 'الحساب البنكي الرئيسي', type: 'BANK', account_number: 'EG-MAIN-BANK', bank_name: 'البنك الأهلي', balance_account_id: DEFAULT_ACCOUNT_IDS.BANK, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

export const INITIAL_INVOICES: Invoice[] = [];
