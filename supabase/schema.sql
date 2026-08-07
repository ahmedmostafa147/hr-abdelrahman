-- ERP System (Abdelrahman Elzaeim) - Supabase Database Schema
-- Strict Double-Entry General Ledger Foundation & Piastre Currency Precision

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE account_type AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');
CREATE TYPE party_type AS ENUM ('CUSTOMER', 'SUPPLIER', 'BOTH');
CREATE TYPE invoice_type AS ENUM ('SALE', 'PURCHASE', 'SALE_RETURN', 'PURCHASE_RETURN');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT');
CREATE TYPE entry_status AS ENUM ('POSTED', 'REVERSED');
CREATE TYPE cashbox_type AS ENUM ('CASH', 'BANK');

-- 2. ACCOUNTS TABLE (Chart of Accounts / شجرة الحسابات)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  type account_type NOT NULL,
  parent_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. PARTIES TABLE (Customers & Suppliers / العملاء والموردين)
CREATE TABLE IF NOT EXISTS parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  party_type party_type NOT NULL DEFAULT 'CUSTOMER',
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  tax_number VARCHAR(100),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 4. CATEGORIES & PRODUCTS TABLE (الأصناف والمنتجات)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) DEFAULT 'piece',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  purchase_price_cents BIGINT NOT NULL DEFAULT 0,
  selling_price_cents BIGINT NOT NULL DEFAULT 0,
  avg_cost_cents BIGINT NOT NULL DEFAULT 0,
  min_stock_alert INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 5. CASHBOXES & BANKS TABLE (الخزائن والحسابات البنكية)
CREATE TABLE IF NOT EXISTS cashboxes_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type cashbox_type NOT NULL DEFAULT 'CASH',
  account_number VARCHAR(100),
  bank_name VARCHAR(255),
  balance_account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 6. JOURNAL ENTRIES & LINES TABLE (الدفتر العام / قيود اليومية)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_number VARCHAR(50) UNIQUE NOT NULL,
  entry_date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  reference_type VARCHAR(100),
  reference_id UUID,
  status entry_status NOT NULL DEFAULT 'POSTED',
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS journal_entry_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  party_id UUID REFERENCES parties(id) ON DELETE SET NULL,
  debit_cents BIGINT NOT NULL DEFAULT 0,
  credit_cents BIGINT NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_debit_credit_non_negative CHECK (debit_cents >= 0 AND credit_cents >= 0)
);

-- 7. INVOICES & INVOICE ITEMS (الفواتير والمرتجعات)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_type invoice_type NOT NULL,
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE RESTRICT,
  status invoice_status NOT NULL DEFAULT 'POSTED',
  total_amount_cents BIGINT NOT NULL DEFAULT 0,
  tax_amount_cents BIGINT NOT NULL DEFAULT 0,
  discount_amount_cents BIGINT NOT NULL DEFAULT 0,
  net_amount_cents BIGINT NOT NULL DEFAULT 0,
  paid_amount_cents BIGINT NOT NULL DEFAULT 0,
  due_amount_cents BIGINT NOT NULL DEFAULT 0,
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price_cents BIGINT NOT NULL DEFAULT 0,
  total_price_cents BIGINT NOT NULL DEFAULT 0,
  avg_cost_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY MOVEMENTS (حركات المخزون)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  movement_type movement_type NOT NULL,
  quantity INT NOT NULL,
  unit_cost_cents BIGINT NOT NULL DEFAULT 0,
  reference_type VARCHAR(100),
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 9. AUDIT LOGS TABLE (سجل الرقابة والتتبع)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  performed_by VARCHAR(255) DEFAULT 'System',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DEFAULT SEED DATA (الحسابات الأساسية في شجرة الحسابات)
INSERT INTO accounts (id, code, name_ar, name_en, type, is_system) VALUES
  ('10000000-0000-0000-0000-000000000001', '1010', 'الخزينة الرئيسية', 'Main Cashbox', 'ASSET', true),
  ('10000000-0000-0000-0000-000000000002', '1020', 'الحساب البنكي الرئيسي', 'Main Bank Account', 'ASSET', true),
  ('10000000-0000-0000-0000-000000000003', '1100', 'حسابات العملاء (مدينون)', 'Accounts Receivable', 'ASSET', true),
  ('10000000-0000-0000-0000-000000000004', '1200', 'حساب المخزون', 'Inventory Account', 'ASSET', true),
  ('10000000-0000-0000-0000-000000000005', '2100', 'حسابات الموردين (دائنون)', 'Accounts Payable', 'LIABILITY', true),
  ('10000000-0000-0000-0000-000000000006', '3100', 'رأس المال', 'Owner Capital', 'EQUITY', true),
  ('10000000-0000-0000-0000-000000000007', '4100', 'إيرادات المبيعات', 'Sales Revenue', 'REVENUE', true),
  ('10000000-0000-0000-0000-000000000008', '5100', 'تكلفة البضاعة المباعة', 'Cost of Goods Sold', 'EXPENSE', true),
  ('10000000-0000-0000-0000-000000000009', '6100', 'مصروفات تشغيلية وعامة', 'General Expenses', 'EXPENSE', true)
ON CONFLICT (code) DO NOTHING;

-- DEFAULT CASHBOX AND BANK RECORDS
INSERT INTO cashboxes_banks (id, name, type, balance_account_id) VALUES
  ('20000000-0000-0000-0000-000000000001', 'الخزينة الرئيسية', 'CASH', '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', 'الحساب البنكي الرئيسي', 'BANK', '10000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;
