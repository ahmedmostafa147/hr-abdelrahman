'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wallet, Plus, Search, Shield, User } from 'lucide-react';
import { ERPStore } from '@/core/database/mockStore';
import { calculateDashboardMetrics } from '@/core/database/ledgerEngine';
import { formatCurrency } from '@/core/utils/currency';

export default function Header() {
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    const entries = ERPStore.getJournalEntries();
    const metrics = calculateDashboardMetrics(entries);
    setCashBalance(metrics.totalLiquidAssetsCents);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث عن عميل، فاتورة، أو قيد..."
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>سيولة الخزينة والبنك:</span>
          <span className="font-bold dir-ltr">{formatCurrency(cashBalance)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/sales?new=true"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>فاتورة جديدة</span>
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold leading-tight">عبدالرحمن الزعيم</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500 inline" /> مدير النظام
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
