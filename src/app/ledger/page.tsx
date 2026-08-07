'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ManualEntryDialog from '@/features/ledger/ManualEntryDialog';
import { ERPStore } from '@/core/database/mockStore';
import { INITIAL_ACCOUNTS } from '@/core/database/mockData';
import { JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { BookOpen, Plus } from 'lucide-react';

export default function LedgerPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadData = () => {
    setEntries(ERPStore.getJournalEntries());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">الدفتر العام وقيد اليومية (General Ledger)</h1>
            <p className="text-xs text-slate-500 mt-1">مصدر الحقيقة الوحيد (Single Source of Truth) لكافة التعاملات المالية</p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قيد يدوي</span>
          </button>
        </div>

        {/* Ledger Entries List */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{entry.description || entry.entry_number}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {entry.entry_number} • {new Date(entry.entry_date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold">
                  مرحل بالدفتر العام
                </span>
              </div>

              {/* Journal Entry Lines Table */}
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 border-y border-slate-100">
                  <tr>
                    <th className="p-2">الحساب</th>
                    <th className="p-2">البيان</th>
                    <th className="p-2">مدين (Debit)</th>
                    <th className="p-2">دائن (Credit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(entry.lines || []).map((line, idx) => {
                    const acc = INITIAL_ACCOUNTS.find((a) => a.id === line.account_id);
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-800">
                          {acc?.code} - {acc?.name_ar || 'حساب فرعي'}
                        </td>
                        <td className="p-2 text-slate-500">{line.description || '-'}</td>
                        <td className="p-2 font-bold text-emerald-600 dir-ltr">
                          {line.debit_cents > 0 ? formatCurrency(line.debit_cents) : '-'}
                        </td>
                        <td className="p-2 font-bold text-purple-600 dir-ltr">
                          {line.credit_cents > 0 ? formatCurrency(line.credit_cents) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <ManualEntryDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSaved={loadData} />
    </DashboardLayout>
  );
}
