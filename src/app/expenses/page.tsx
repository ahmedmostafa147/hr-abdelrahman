'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExpenseDialog from '@/features/expenses/ExpenseDialog';
import { ERPStore } from '@/core/database/mockStore';
import { DEFAULT_ACCOUNT_IDS } from '@/core/constants/accounts';
import { CashboxBank, JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Plus, Receipt } from 'lucide-react';

export default function ExpensesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [cashboxes, setCashboxes] = useState<CashboxBank[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadData = () => {
    setEntries(ERPStore.getJournalEntries());
    setCashboxes(ERPStore.getCashboxes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const expenseEntries = entries.filter((e) =>
    (e.lines || []).some((l) => l.account_id === DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES)
  );

  const totalExpenseCents = expenseEntries.reduce((acc, e) => {
    const expenseLine = (e.lines || []).find((l) => l.account_id === DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES);
    return acc + (expenseLine?.debit_cents || 0);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">سجل المصروفات والنثريات</h1>
            <p className="text-xs text-slate-500 mt-1">خصم فوري من الخزينة/البنك مع خصمها التلقائي من الأرباح</p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل مصروف جديد</span>
          </button>
        </div>

        {/* Expense Total Card */}
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">إجمالي المصروفات المسجلة</p>
            <h2 className="text-2xl font-bold text-rose-600 mt-1 dir-ltr">{formatCurrency(totalExpenseCents)}</h2>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Expenses List Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">رقم القيد</th>
                  <th className="p-3.5">البيان والتفاصيل</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">قيمة المصروف</th>
                  <th className="p-3.5">الحالة المحاسبية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expenseEntries.map((e) => {
                  const expenseLine = (e.lines || []).find((l) => l.account_id === DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold font-mono text-slate-900">{e.entry_number}</td>
                      <td className="p-3.5 text-slate-800">{e.description}</td>
                      <td className="p-3.5 text-slate-500">{new Date(e.entry_date).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3.5 font-bold text-rose-600 dir-ltr">{formatCurrency(expenseLine?.debit_cents || 0)}</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          مخصوم من الدفتر العام
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ExpenseDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSaved={loadData} cashboxes={cashboxes} />
    </DashboardLayout>
  );
}
