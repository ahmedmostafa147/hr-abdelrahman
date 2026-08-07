import { Account, Party, Product, CashboxBank, JournalEntry, JournalEntryLine, Invoice } from '../types/database.types';
import { DEFAULT_ACCOUNT_IDS } from '../constants/accounts';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: DEFAULT_ACCOUNT_IDS.CASH, code: '1010', name_ar: 'الخزينة الرئيسية', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.BANK, code: '1020', name_ar: 'الحساب البنكي الرئيسي', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.RECEIVABLE, code: '1100', name_ar: 'حسابات العملاء (مدينون)', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.INVENTORY, code: '1200', name_ar: 'حساب المخزون', type: 'ASSET', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.PAYABLE, code: '2100', name_ar: 'حسابات الموردين (دائنون)', type: 'LIABILITY', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.CAPITAL, code: '3100', name_ar: 'رأس المال', type: 'EQUITY', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.SALES_REVENUE, code: '4100', name_ar: 'إيرادات المبيعات', type: 'REVENUE', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.COGS, code: '5100', name_ar: 'تكلفة البضاعة المباعة', type: 'EXPENSE', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES, code: '6100', name_ar: 'مصروفات تشغيلية وعامة', type: 'EXPENSE', is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_PARTIES: Party[] = [
  { id: 'p1', code: 'CUST-001', name: 'شركة الأمل للتجارة (عميل)', party_type: 'CUSTOMER', phone: '01012345678', address: 'القاهرة - مدينة نصر', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'p2', code: 'SUPP-001', name: 'مصنع الشرق للصناعة (مورد)', party_type: 'SUPPLIER', phone: '01298765432', address: 'العاشر من رمضان', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'p3', code: 'BOTH-001', name: 'الشركة العربية الكبرى (عميل ومورد)', party_type: 'BOTH', phone: '01155443322', address: 'الجيزة - الدقي', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod1', code: 'PRD-101', barcode: '6221001', name: 'شاشة 55 بوصة 4K Smart', unit: 'قطعة', purchase_price_cents: 1500000, selling_price_cents: 1950000, avg_cost_cents: 1500000, min_stock_alert: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'prod2', code: 'PRD-102', barcode: '6221002', name: 'جهاز تكييف 2.25 حصان Inverter', unit: 'جهاز', purchase_price_cents: 2200000, selling_price_cents: 2700000, avg_cost_cents: 2200000, min_stock_alert: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'prod3', code: 'PRD-103', barcode: '6221003', name: 'مكواة بخار سيراميك', unit: 'قطعة', purchase_price_cents: 80000, selling_price_cents: 125000, avg_cost_cents: 80000, min_stock_alert: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_CASHBOXES: CashboxBank[] = [
  { id: 'cb1', name: 'الخزينة الرئيسية', type: 'CASH', balance_account_id: DEFAULT_ACCOUNT_IDS.CASH, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cb2', name: 'حساب البنك الأهلي', type: 'BANK', account_number: 'EG1200010001', bank_name: 'البنك الأهلي المصري', balance_account_id: DEFAULT_ACCOUNT_IDS.BANK, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je1',
    entry_number: 'JV-2026-001',
    entry_date: new Date().toISOString(),
    description: 'قيد افتتاح رأس المال والإيداع بالخزينة',
    status: 'POSTED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lines: [
      { id: 'l1', account_id: DEFAULT_ACCOUNT_IDS.CASH, debit_cents: 50000000, credit_cents: 0, description: 'إيداع بالخزينة الرئيسية' },
      { id: 'l2', account_id: DEFAULT_ACCOUNT_IDS.CAPITAL, debit_cents: 0, credit_cents: 50000000, description: 'رأس مال صاحب النشاط' },
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoice_number: 'INV-2026-001',
    invoice_type: 'SALE',
    party_id: 'p1',
    status: 'POSTED',
    total_amount_cents: 1950000,
    tax_amount_cents: 0,
    discount_amount_cents: 0,
    net_amount_cents: 1950000,
    paid_amount_cents: 1000000,
    due_amount_cents: 950000,
    issue_date: new Date().toISOString(),
    journal_entry_id: 'je2',
    items: [
      { id: 'item1', product_id: 'prod1', quantity: 1, unit_price_cents: 1950000, total_price_cents: 1950000, avg_cost_cents: 1500000 }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
