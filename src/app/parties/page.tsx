'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PartyDialog from '@/features/parties/PartyDialog';
import PartyPaymentDialog from '@/features/parties/PartyPaymentDialog';
import { ERPStore } from '@/core/database/mockStore';
import { calculatePartyBalance } from '@/core/database/ledgerEngine';
import { Party, CashboxBank, JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Plus, UserCheck, DollarSign, Search } from 'lucide-react';

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [cashboxes, setCashboxes] = useState<CashboxBank[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentParty, setPaymentParty] = useState<Party | null>(null);

  const loadData = () => {
    setParties(ERPStore.getParties());
    setEntries(ERPStore.getJournalEntries());
    setCashboxes(ERPStore.getCashboxes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredParties = parties.filter((p) => {
    const matchesSearch = p.name.includes(search) || p.code.includes(search) || (p.phone && p.phone.includes(search));
    const matchesType = filterType === 'ALL' || p.party_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">إدارة العملاء والموردين (Parties)</h1>
            <p className="text-xs text-slate-500 mt-1">جدول موحد مع احتساب تلقائي للمديونيات من الدفتر العام</p>
          </div>
          <button
            onClick={() => { setSelectedParty(null); setIsDialogOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طرف جديد</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم الطرف أو الكود أو الهاتف..."
              className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {['ALL', 'CUSTOMER', 'SUPPLIER', 'BOTH'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === type ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'الكل' : type === 'CUSTOMER' ? 'العملاء' : type === 'SUPPLIER' ? 'الموردين' : 'مزدوج'}
              </button>
            ))}
          </div>
        </div>

        {/* Parties Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود والاسم</th>
                  <th className="p-3.5">صفة التعامل</th>
                  <th className="p-3.5">رقم الهاتف</th>
                  <th className="p-3.5">الرصيد اللحظي (من GL)</th>
                  <th className="p-3.5 text-center">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredParties.map((p) => {
                  const netBalanceCents = calculatePartyBalance(entries, p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{p.code}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.party_type === 'CUSTOMER' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          p.party_type === 'SUPPLIER' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {p.party_type === 'CUSTOMER' ? 'عميل' : p.party_type === 'SUPPLIER' ? 'مورد' : 'عميل ومورد'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{p.phone || '-'}</td>
                      <td className="p-3.5 font-bold dir-ltr">
                        <span className={netBalanceCents > 0 ? 'text-emerald-600' : netBalanceCents < 0 ? 'text-rose-600' : 'text-slate-500'}>
                          {formatCurrency(netBalanceCents)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {netBalanceCents > 0 ? '(مستحق لنا)' : netBalanceCents < 0 ? '(مستحق علينا)' : '(متزن)'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setPaymentParty(p); setIsPaymentOpen(true); }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 font-bold flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> قبض / صرف
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PartyDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSaved={loadData} initialParty={selectedParty} />
      {paymentParty && (
        <PartyPaymentDialog isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onSaved={loadData} party={paymentParty} cashboxes={cashboxes} />
      )}
    </DashboardLayout>
  );
}
