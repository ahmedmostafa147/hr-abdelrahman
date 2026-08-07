'use client';

import { JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { ArrowUpLeft, ArrowDownRight, FileText } from 'lucide-react';

interface RecentTransactionsProps {
  entries: JournalEntry[];
}

export default function RecentTransactions({ entries }: RecentTransactionsProps) {
  const recentList = entries.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>آخر العمليات والقيود</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">مباشرة من الدفتر العام</span>
      </div>

      <div className="divide-y divide-slate-100">
        {recentList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">لا توجد عمليات مسجلة حتى الآن</p>
        ) : (
          recentList.map((entry) => {
            const totalAmountCents = (entry.lines || []).reduce(
              (acc, line) => acc + (line.debit_cents || 0),
              0
            );

            return (
              <div key={entry.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    {totalAmountCents > 0 ? (
                      <ArrowUpLeft className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{entry.description || entry.entry_number}</p>
                    <p className="text-[10px] text-slate-400">
                      {entry.entry_number} • {new Date(entry.entry_date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block dir-ltr">
                    {formatCurrency(totalAmountCents)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    مرحل تلقائياً
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
