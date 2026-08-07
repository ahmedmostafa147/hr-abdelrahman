'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/features/dashboard/MetricCard';
import RecentTransactions from '@/features/dashboard/RecentTransactions';
import TopCustomers from '@/features/dashboard/TopCustomers';
import StockAlerts from '@/features/dashboard/StockAlerts';
import PageGuide from '@/components/ui/PageGuide';
import { ERPStore } from '@/core/database/mockStore';
import { calculateDashboardMetrics } from '@/core/database/ledgerEngine';
import { Party, Product, Invoice, JournalEntry } from '@/core/types/database.types';
import { Wallet, Landmark, UserCheck, Truck, ShoppingCart, ShoppingBag, Receipt, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    cashboxBalanceCents: 0, bankBalanceCents: 0, totalReceivablesCents: 0,
    totalPayablesCents: 0, totalSalesCents: 0, totalExpensesCents: 0, netProfitCents: 0,
  });
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const journalEntries = ERPStore.getJournalEntries();
    setEntries(journalEntries);
    setMetrics(calculateDashboardMetrics(journalEntries));
    setParties(ERPStore.getParties());
    setProducts(ERPStore.getProducts());
    setInvoices(ERPStore.getInvoices());
  }, []);

  const hasOpeningEntry = entries.some(e => e.entry_number === 'JV-OPEN-001');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مرحباً بك، عبدالرحمن الزعيم</h1>
          <p className="text-xs text-slate-500 mt-1">نظرة عامة على نشاط الأكياس والشنط البلاستيك والموقف المالي اللحظي</p>
        </div>

        {/* CLEAN WHITE / SLATE OPENING BALANCES WARNING BANNER */}
        {!hasOpeningEntry && (
          <div className="bg-white text-slate-900 rounded-xl p-5 shadow-xs border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">تنبيه هام: يرجى إدخال الأرصدة الافتتاحية أولاً</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  لأنك تبدأ بالنظام لنشاطك التجاري القائم، ينبغي إدخال <strong>الأرصدة الافتتاحية</strong> (الخزينة، البنك، ديون العملاء والموردين) لتأسيس الدفتر العام.
                </p>
              </div>
            </div>
            <Link
              href="/opening-balances"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shrink-0 shadow-xs transition-all"
            >
              <span>إدخال الأرصدة الافتتاحية الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        )}

        <PageGuide
          title="لوحة التحكم الرئيسية"
          description="تعرض هذه الشاشة الخلاصة المالية والتجارية اللحظية المحسوبة تلقائياً من الدفتر العام."
          points={[
            'كل رقم في هذه الشاشة يُحسب ديناميكياً من واقع قيود اليومية المحاسبية المزدوجة.',
            'سيولة الخزينة والبنك تعكس النقود الفعلية المتوفرة لديك حالياً.',
            'ديون العملاء وديون الموردين تُحدث فوراً بمجرد إنشاء أي فاتورة أو تحصيل أو سداد.',
          ]}
        />

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="رصيد الخزينة الرئيسية" amountCents={metrics.cashboxBalanceCents} icon={Wallet} variant="emerald" />
          <MetricCard title="رصيد الحساب البنكي" amountCents={metrics.bankBalanceCents} icon={Landmark} variant="blue" />
          <MetricCard title="ديون العملاء (لنا)" amountCents={metrics.totalReceivablesCents} icon={UserCheck} variant="amber" />
          <MetricCard title="ديون الموردين (علينا)" amountCents={metrics.totalPayablesCents} icon={Truck} variant="rose" />
        </div>

        {/* Secondary Operations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="إجمالي المبيعات" amountCents={metrics.totalSalesCents} icon={ShoppingCart} variant="blue" />
          <MetricCard title="إجمالي المصروفات والتكلفة" amountCents={metrics.totalExpensesCents} icon={Receipt} variant="rose" />
          <MetricCard title="صافي الربح الحقيقي" amountCents={metrics.netProfitCents} icon={DollarSign} variant="emerald" subtitle="محسوب تلقائياً من الدفتر العام" />
          <MetricCard title="إجمالي المشتريات" amountCents={0} icon={ShoppingBag} variant="slate" />
        </div>

        {/* Content Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentTransactions entries={entries} />
          </div>
          <div className="space-y-6">
            <TopCustomers parties={parties} invoices={invoices} />
            <StockAlerts products={products} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
