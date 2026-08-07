'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ERPStore } from '@/core/database/mockStore';
import { calculateDashboardMetrics, calculateAccountBalance } from '@/core/database/ledgerEngine';
import { INITIAL_ACCOUNTS } from '@/core/database/mockData';
import { JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { FileBarChart, Printer } from 'lucide-react';

export default function ReportsPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'PNL' | 'TRIAL'>('PNL');

  useEffect(() => {
    setEntries(ERPStore.getJournalEntries());
  }, []);

  const metrics = calculateDashboardMetrics(entries);

  return (
    <DashboardLayout>
      <div className="space-y-6 printable-area">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">التقارير والقوائم المالية الإختامية</h1>
            <p className="text-xs text-slate-500 mt-1">تقارير قائمة الدخل، ميزان المراجعة، والتدفقات النقدية المحسوبة تلقائياً</p>
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs">
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير (PDF)</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => setActiveTab('PNL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PNL' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border text-slate-700'
            }`}
          >
            قائمة الدخل (Profit & Loss)
          </button>
          <button
            onClick={() => setActiveTab('TRIAL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'TRIAL' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border text-slate-700'
            }`}
          >
            ميزان المراجعة (Trial Balance)
          </button>
        </div>

        {/* P&L Statement View */}
        {activeTab === 'PNL' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">قائمة الدخل - Profit & Loss</h2>
                <p className="text-xs text-slate-400">الفترة المالية لعام 2026</p>
              </div>
              <FileBarChart className="w-8 h-8 text-blue-600" />
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg text-emerald-900 font-bold">
                <span>(+) إجمالي إيرادات المبيعات</span>
                <span className="dir-ltr">{formatCurrency(metrics.totalSalesCents)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg text-rose-900 font-bold">
                <span>(-) تكلفة البضاعة والمصروفات العمومية</span>
                <span className="dir-ltr">{formatCurrency(metrics.totalExpensesCents)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-900 text-white rounded-xl font-bold text-sm">
                <span>(=) صافي الربح الحقيقي (Net Profit)</span>
                <span className="dir-ltr text-emerald-400 text-lg">{formatCurrency(metrics.netProfitCents)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Trial Balance View */}
        {activeTab === 'TRIAL' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">ميزان المراجعة بالحركات والأرصدة</h2>

            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 font-bold text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="p-3">كود واسم الحساب</th>
                  <th className="p-3">نوع الحساب</th>
                  <th className="p-3">إجمالي المدين</th>
                  <th className="p-3">إجمالي الدائن</th>
                  <th className="p-3 text-left">الرصيد النهائي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {INITIAL_ACCOUNTS.map((acc) => {
                  const summary = calculateAccountBalance(entries, acc.id, acc.type);
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{acc.code} - {acc.name_ar}</td>
                      <td className="p-3 text-slate-500">{acc.type}</td>
                      <td className="p-3 font-bold text-emerald-600 dir-ltr">{formatCurrency(summary.debitCents)}</td>
                      <td className="p-3 font-bold text-purple-600 dir-ltr">{formatCurrency(summary.creditCents)}</td>
                      <td className="p-3 font-bold text-left dir-ltr text-slate-900">{formatCurrency(summary.balanceCents)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
