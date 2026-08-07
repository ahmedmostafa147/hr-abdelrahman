'use client';

import { Party } from '@/core/types/database.types';
import { UserCheck, Truck } from 'lucide-react';

interface Props {
  parties: Party[];
  partyBalances: Record<string, number>;
  onChange: (id: string, val: number) => void;
}

export default function PartyBalancesList({ parties, partyBalances, onChange }: Props) {
  const customers = parties.filter((p) => p.party_type === 'CUSTOMER' || p.party_type === 'BOTH');
  const suppliers = parties.filter((p) => p.party_type === 'SUPPLIER');

  return (
    <div className="space-y-4">
      {/* Customers */}
      <div className="space-y-2">
        <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" /> ديون العملاء (لنا عندهم)
        </p>
        {customers.length === 0 ? (
          <p className="text-slate-400 text-[11px]">لا يوجد عملاء — أضفهم من شاشة العملاء أولاً</p>
        ) : customers.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg">
            <p className="font-bold text-slate-800 text-xs">{p.name}</p>
            <input type="number" step="0.01" placeholder="0.00" value={partyBalances[p.id] || ''}
              onChange={(e) => onChange(p.id, parseFloat(e.target.value) || 0)}
              className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-left"
            />
          </div>
        ))}
      </div>

      {/* Suppliers */}
      <div className="space-y-2">
        <p className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> ديون الموردين (علينا لهم)
        </p>
        {suppliers.length === 0 ? (
          <p className="text-slate-400 text-[11px]">لا يوجد موردين — أضفهم من شاشة الموردين أولاً</p>
        ) : suppliers.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg">
            <p className="font-bold text-slate-800 text-xs">{p.name}</p>
            <input type="number" step="0.01" placeholder="0.00" value={partyBalances[p.id] || ''}
              onChange={(e) => onChange(p.id, parseFloat(e.target.value) || 0)}
              className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-left"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
