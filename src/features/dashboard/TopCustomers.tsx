'use client';

import { Party, Invoice } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Users, TrendingUp } from 'lucide-react';

interface TopCustomersProps {
  parties: Party[];
  invoices: Invoice[];
}

export default function TopCustomers({ parties, invoices }: TopCustomersProps) {
  const customerSales: Record<string, number> = {};

  invoices.forEach((inv) => {
    if (inv.invoice_type === 'SALE' && inv.status === 'POSTED') {
      customerSales[inv.party_id] = (customerSales[inv.party_id] || 0) + inv.net_amount_cents;
    }
  });

  const sortedCustomers = parties
    .filter((p) => p.party_type === 'CUSTOMER' || p.party_type === 'BOTH')
    .map((p) => ({
      ...p,
      totalSalesCents: customerSales[p.id] || 0,
    }))
    .sort((a, b) => b.totalSalesCents - a.totalSalesCents)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>أكثر العملاء شراءً</span>
        </h3>
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      </div>

      <div className="space-y-3">
        {sortedCustomers.map((cust, idx) => (
          <div key={cust.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">{cust.name}</p>
                <p className="text-[10px] text-slate-500">{cust.code} • {cust.phone || 'بدون هاتف'}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 dir-ltr">
              {formatCurrency(cust.totalSalesCents)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
