'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransferDialog from '@/features/cashbox/TransferDialog';
import { ERPStore } from '@/core/database/mockStore';
import { calculateAccountBalance } from '@/core/database/ledgerEngine';
import { CashboxBank, JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Wallet, Landmark, ArrowLeftRight } from 'lucide-react';

export default function CashboxPage() {
  const [cashboxes, setCashboxes] = useState<CashboxBank[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const loadData = () => {
    setCashboxes(ERPStore.getCashboxes());
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
            <h1 className="text-2xl font-bold text-slate-900">إدارة الخزائن والحسابات البنكية</h1>
            <p className="text-xs text-slate-500 mt-1">السيولة النقدية المحسوبة تلقائياً من واقع قيود المقبوضات والمصروفات</p>
          </div>
          <button
            onClick={() => setIsTransferOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>تحويل بين الخزينة والبنك</span>
          </button>
        </div>

        {/* Cash & Bank Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cashboxes.map((cb) => {
            const summary = calculateAccountBalance(entries, cb.balance_account_id, 'ASSET');
            const Icon = cb.type === 'CASH' ? Wallet : Landmark;
            return (
              <div key={cb.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{cb.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{cb.account_number || 'حساب رئيسي'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">
                    {cb.type === 'CASH' ? 'خزينة نقداً' : 'حساب بنكي'}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">الرصيد الفعلي الحالي:</span>
                  <span className="text-2xl font-bold text-emerald-600 dir-ltr">
                    {formatCurrency(summary.balanceCents)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TransferDialog isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} onSaved={loadData} cashboxes={cashboxes} />
    </DashboardLayout>
  );
}
