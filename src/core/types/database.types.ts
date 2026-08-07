export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type PartyType = 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
export type InvoiceType = 'SALE' | 'PURCHASE' | 'SALE_RETURN' | 'PURCHASE_RETURN';
export type InvoiceStatus = 'DRAFT' | 'POSTED' | 'CANCELLED';
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';
export type EntryStatus = 'POSTED' | 'REVERSED';
export type CashboxType = 'CASH' | 'BANK';

export interface Account {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  type: AccountType;
  parent_id?: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Party {
  id: string;
  code: string;
  name: string;
  party_type: PartyType;
  phone?: string;
  email?: string;
  address?: string;
  tax_number?: string;
  account_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  deleted_at?: string;
}

export interface Product {
  id: string;
  code: string;
  barcode?: string;
  name: string;
  unit: string;
  category_id?: string;
  purchase_price_cents: number;
  selling_price_cents: number;
  avg_cost_cents: number;
  min_stock_alert: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CashboxBank {
  id: string;
  name: string;
  type: CashboxType;
  account_number?: string;
  bank_name?: string;
  balance_account_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface JournalEntryLine {
  id?: string;
  journal_entry_id?: string;
  account_id: string;
  party_id?: string;
  debit_cents: number;
  credit_cents: number;
  description?: string;
  created_at?: string;
}

export interface JournalEntry {
  id: string;
  entry_number: string;
  entry_date: string;
  description?: string;
  reference_type?: string;
  reference_id?: string;
  status: EntryStatus;
  created_by?: string;
  lines?: JournalEntryLine[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
  avg_cost_cents: number;
  product?: Product;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  invoice_type: InvoiceType;
  party_id: string;
  party?: Party;
  status: InvoiceStatus;
  total_amount_cents: number;
  tax_amount_cents: number;
  discount_amount_cents: number;
  net_amount_cents: number;
  paid_amount_cents: number;
  due_amount_cents: number;
  issue_date: string;
  due_date?: string;
  journal_entry_id?: string;
  notes?: string;
  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data?: Record<string, unknown> | object;
  new_data?: Record<string, unknown> | object;
  performed_by: string;
  created_at: string;
}
