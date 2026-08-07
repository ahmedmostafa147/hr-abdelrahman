'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageGuide from '@/components/ui/PageGuide';
import { ERPStore } from '@/core/database/mockStore';
import { DEFAULT_ACCOUNT_IDS } from '@/core/constants/accounts';
import { Party, Product, JournalEntry, JournalEntryLine } from '@/core/types/database.types';
import { toPiastres } from '@/core/utils/currency';
import { Wallet, Users, Save, CheckCircle2 } from 'lucide-react';

export default function OpeningBalancesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [cashEGP, setCashEGP] = useState('');
  const [bankEGP, setBankEGP] = useState('');
  const [partyBalances, setPartyBalances] = useState<Record<string, number>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { setParties(ERPStore.getParties()); }, []);

  const handlePartyChange = (id: string, egp: number) => {
    setPartyBalances((prev) => ({ ...prev, [id]: egp }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cashCents = toPiastres(parseFloat(cashEGP) || 0);
    const bankCents = toPiastres(parseFloat(bankEGP) || 0);
    const lines: JournalEntryLine[] = [];
    let totalDebit = 0; let totalCredit = 0;

    if (cashCents > 0) { lines.push({ account_id: DEFAULT_ACCOUNT_IDS.CASH, debit_cents: cashCents, credit_cents: 0, description: 'رصيد الخزينة الافتتاحي' }); totalDebit += cashCents; }
    if (bankCents > 0) { lines.push({ account_id: DEFAULT_ACCOUNT_IDS.BANK, debit_cents: bankCents, credit_cents: 0, description: 'رصيد البنك الافتتاحي' }); totalDebit += bankCents; }

    parties.forEach((p) => {
      const valCents = toPiastres(partyBalances[p.id] || 0);
      if (valCents > 0) {
        if (p.party_type === 'CUSTOMER' || p.party_type === 'BOTH') {
          lines.push({ account_id: DEFAULT_ACCOUNT_IDS.RECEIVABLE, party_id: p.id, debit_cents: valCents, credit_cents: 0, description: `رصيد أول المدة لـ ${p.name}` });
          totalDebit += valCents;
        } else {
          lines.push({ account_id: DEFAULT_ACCOUNT_IDS.PAYABLE, party_id: p.id, debit_cents: 0, credit_cents: valCents, description: `رصيد أول المدة لـ ${p.name}` });
          totalCredit += valCents;
        }
      }
    });

    const netCapital = totalDebit - totalCredit;
    if (netCapital > 0) lines.push({ account_id: DEFAULT_ACCOUNT_IDS.CAPITAL, debit_cents: 0, credit_cents: netCapital, description: 'موازنة الأرصدة الافتتاحية برأس المال' });
    else if (netCapital < 0) lines.push({ account_id: DEFAULT_ACCOUNT_IDS.CAPITAL, debit_cents: Math.abs(netCapital), credit_cents: 0, description: 'موازنة الأرصدة الافتتاحية برأس المال' });

    ERPStore.addJournalEntry({
      id: 'je_open_' + Date.now(), entry_number: 'JV-OPEN-001', entry_date: new Date().toISOString(),
      description: 'قيد إثبات الأرصدة الافتتاحية وأول المدة', status: 'POSTED', created_by: 'عبدالرحمن الزعيم', lines,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    setIsSaved(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدخال الأرصدة الافتتاحية (Opening Balances)</h1>
          <p className="text-xs text-slate-500 mt-1">تحديد أرصدة الخزينة، البنوك، مديونيات العملاء، واستحقاقات الموردين السابقة لإنشاء قيد البداية</p>
        </div>

        <PageGuide
          title="أهم خطوة في بداية تشغيل النظام"
          description="تضمن هذه الشاشة تحويل أرصدتك السابقة قبل استخدام النظام إلى قيد افتتاحي متزن بالدفتر العام."
          points={[
            'أدخل السيولة النقدية المتوفرة في الخزينة والبنك حالياً.',
            'أدخل مديونية كل عميل سابقة أو مستحقات الموردين لتسجيل القيد الافتتاحي (JV-OPEN-001).',
            'يقوم النظام بموازنة صافي الفرق تلقائياً مع حساب رأس المال وحقوق الملكية (3100).',
          ]}
        />

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تم اعتماد وترحيل قيد الأرصدة الافتتاحية (JV-OPEN-001) بنجاح إلى الدفتر العام!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Wallet className="w-4 h-4 text-blue-600" /><span>1. أثر النقدية والسيولة المتاحة (خزينة وبنك)</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="font-semibold text-slate-700 block mb-1">رصيد الخزينة الرئيسية (EGP)</label><input type="number" step="0.01" value={cashEGP} onChange={(e) => setCashEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold dir-ltr" /></div>
              <div><label className="font-semibold text-slate-700 block mb-1">رصيد البنك الأهلي (EGP)</label><input type="number" step="0.01" value={bankEGP} onChange={(e) => setBankEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold dir-ltr" /></div>
            </div>
          </div>

          <div className="space-y-3 border-b border-slate-100 pb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" /><span>2. أرصدة مديونيات العملاء واستحقاقات الموردين السابقة</span></h3>
            {parties.length === 0 ? (<p className="text-slate-400">قم بإضافة العملاء والموردين أولاً من شاشة العملاء والموردين لتحديد أرصدتهم الحالية.</p>) : (
              <div className="space-y-2">
                {parties.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div><p className="font-bold text-slate-900">{p.name}</p><p className="text-[10px] text-slate-500">{p.party_type === 'CUSTOMER' ? 'عميل' : p.party_type === 'SUPPLIER' ? 'مورد' : 'مزدوج'}</p></div>
                    <input type="number" step="0.01" placeholder="0.00 EGP" value={partyBalances[p.id] || ''} onChange={(e) => handlePartyChange(p.id, parseFloat(e.target.value) || 0)} className="w-36 px-3 py-1.5 bg-white border border-slate-300 rounded font-bold dir-ltr" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-md">
              <Save className="w-4 h-4" /> <span>حفظ وترحيل قيد الأرصدة الافتتاحية</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
