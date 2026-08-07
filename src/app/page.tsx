"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/features/dashboard/MetricCard";
import RecentTransactions from "@/features/dashboard/RecentTransactions";
import TopCustomers from "@/features/dashboard/TopCustomers";
import StockAlerts from "@/features/dashboard/StockAlerts";
import { ERPStore } from "@/core/database/mockStore";
import { calculateDashboardMetrics } from "@/core/database/ledgerEngine";
import {
  Party,
  Product,
  Invoice,
  JournalEntry,
} from "@/core/types/database.types";
import {
  Wallet,
  Landmark,
  UserCheck,
  Truck,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    cashboxBalanceCents: 0,
    bankBalanceCents: 0,
    totalReceivablesCents: 0,
    totalPayablesCents: 0,
    totalSalesCents: 0,
    totalExpensesCents: 0,
    netProfitCents: 0,
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            مرحباً بك، عبدالرحمن الزعيم
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            نظرة عامة على النشاط التجاري والموقف المالي اللحظي
          </p>
        </div>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="رصيد الخزينة الرئيسية"
            amountCents={metrics.cashboxBalanceCents}
            icon={Wallet}
            variant="emerald"
          />
          <MetricCard
            title="رصيد الحساب البنكي"
            amountCents={metrics.bankBalanceCents}
            icon={Landmark}
            variant="blue"
          />
          <MetricCard
            title="ديون العملاء (لنا)"
            amountCents={metrics.totalReceivablesCents}
            icon={UserCheck}
            variant="amber"
          />
          <MetricCard
            title="ديون الموردين (علينا)"
            amountCents={metrics.totalPayablesCents}
            icon={Truck}
            variant="rose"
          />
        </div>

        {/* Secondary Operations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="إجمالي المبيعات"
            amountCents={metrics.totalSalesCents}
            icon={ShoppingCart}
            variant="blue"
          />
          <MetricCard
            title="إجمالي المصروفات والتكلفة"
            amountCents={metrics.totalExpensesCents}
            icon={Receipt}
            variant="rose"
          />
          <MetricCard
            title="صافي الربح الحقيقي"
            amountCents={metrics.netProfitCents}
            icon={DollarSign}
            variant="emerald"
            subtitle="محسوب تلقائياً من الدفتر العام"
          />
          <MetricCard
            title="إجمالي المشتريات"
            amountCents={1500000}
            icon={ShoppingBag}
            variant="slate"
          />
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
