'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PartyDialog from '@/features/parties/PartyDialog';
import PartyPaymentDialog from '@/features/parties/PartyPaymentDialog';
import PageGuide from '@/components/ui/PageGuide';
import { ERPStore } from '@/core/database/mockStore';
import { calculatePartyBalance } from '@/core/database/ledgerEngine';
import { Party, CashboxBank, JournalEntry } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Plus, DollarSign, Search } from 'lucide-react';

export default function SuppliersPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [cashboxes, setCashboxes] = useState<CashboxBank[]>([]);
  const [search, setSearch] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentParty, setPaymentParty] = useState<Party | null>(null);

  const loadData = () => {
    setParties(ERPStore.getParties().filter(p => p.party_type === 'SUPPLIER' || p.party_type === 'BOTH'));
    setEntries(ERPStore.getJournalEntries());
    setCashboxes(ERPStore.getCashboxes());
  };

  useEffect(() => { loadData(); }, []);

  const filteredParties = parties.filter((p) =>
    p.name.includes(search) || p.code.includes(search) || (p.phone && p.phone.includes(search))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">إدارة الموردين (Suppliers)</h1>
            <p className="text-xs text-slate-500 mt-1">سجل الموردين واحتساب مستحقاتهم اللحظية من واقع الدفتر العام</p>
          </div>
          <button onClick={() => { setSelectedParty(null); setIsDialogOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs">
            <Plus className="w-4 h-4" /> <span>إضافة مورد جديد</span>
          </button>
        </div>

        <PageGuide
          title="دليل شاشة الموردين"
          description="تستعرض هذه الشاشة قائمة الموردين والمبالغ المستحقة لهم نتيجة فواتير المشتريات الآجلة."
          points={[
            'المبلغ المستحق للمورد يزداد عند شراء بضائع بالأجل، ويقل عند سداد مبالغ نقدية للمورد.',
            'زر (دفع للمورد) ينشئ قيد صرف: خصم المبلغ من الخزينة وتسوية مديونية المورد بالدفتر العام.',
          ]}
        />

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم المورد، الكود، أو الهاتف..." className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الكود والاسم</th>
                  <th className="p-3.5">رقم الهاتف</th>
                  <th className="p-3.5">العنوان</th>
                  <th className="p-3.5">المستحق للمورد (علينا)</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredParties.map((p) => {
                  const netBalanceCents = calculatePartyBalance(entries, p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5"><p className="font-bold text-slate-900">{p.name}</p><span className="text-[10px] text-slate-400 font-mono">{p.code}</span></td>
                      <td className="p-3.5 text-slate-600">{p.phone || '-'}</td>
                      <td className="p-3.5 text-slate-600">{p.address || '-'}</td>
                      <td className="p-3.5 font-bold dir-ltr"><span className={netBalanceCents < 0 ? 'text-rose-600' : 'text-emerald-600'}>{formatCurrency(Math.abs(netBalanceCents))}</span></td>
                      <td className="p-3.5 text-center">
                        <button onClick={() => { setPaymentParty(p); setIsPaymentOpen(true); }} className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1 rounded border border-rose-200 font-bold inline-flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" /> دفع للمورد
                        </button>
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
      {paymentParty && <PartyPaymentDialog isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onSaved={loadData} party={paymentParty} cashboxes={cashboxes} />}
    </DashboardLayout>
  );
}
