'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageGuide from '@/components/ui/PageGuide';
import PartyBalancesList from '@/features/opening-balances/PartyBalancesList';
import { submitOpeningBalances } from '@/features/opening-balances/submitOpeningBalances';
import { ERPStore } from '@/core/database/mockStore';
import { Party } from '@/core/types/database.types';
import { Wallet, Landmark, Receipt, DollarSign, Users, Save, CheckCircle2 } from 'lucide-react';

export default function OpeningBalancesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [cashEGP, setCashEGP] = useState('');
  const [bankEGP, setBankEGP] = useState('');
  const [expensesEGP, setExpensesEGP] = useState('');
  const [revenueEGP, setRevenueEGP] = useState('');
  const [partyBalances, setPartyBalances] = useState<Record<string, number>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setParties(ERPStore.getParties());
  }, []);

  const handlePartyChange = (id: string, egp: number) => {
    setPartyBalances((prev) => ({ ...prev, [id]: egp }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOpeningBalances({
      cashEGP: parseFloat(cashEGP) || 0,
      bankEGP: parseFloat(bankEGP) || 0,
      expensesEGP: parseFloat(expensesEGP) || 0,
      revenueEGP: parseFloat(revenueEGP) || 0,
      partyBalances,
    }, parties);
    setIsSaved(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-xl font-bold text-slate-900">إدخال الأرصدة الافتتاحية الشاملة</h1>
          <p className="text-xs text-slate-500 mt-1">تحديد أرصدة الخزينة، البنك، العملاء، الموردين، المصروفات والإيرادات السابقة</p>
        </div>

        <PageGuide
          title="شاشه تأسيس الأرصدة الافتتاحية"
          description="تحويل كافة الأرصدة والسابقة لنشاطك التجاري إلى قيد افتتاحي متزن بالدفتر العام."
          points={[
            'أدخل رصيد النقدية في الخزينة الرئيسية والحساب البنكي.',
            'أدخل ديون العملاء (مدين) واستحقاقات الموردين (دائن).',
            'أدخل إجمالي المصروفات والإيرادات المرحّلة من الفترات السابقة.',
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
          {/* Section 1: Cash & Bank */}
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span>1. السيولة النقدية (الخزينة والبنك)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">رصيد الخزينة الرئيسية (EGP)</label>
                <input type="number" step="0.01" value={cashEGP} onChange={(e) => setCashEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-left" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">رصيد الحساب البنكي (EGP)</label>
                <input type="number" step="0.01" value={bankEGP} onChange={(e) => setBankEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-left" />
              </div>
            </div>
          </div>

          {/* Section 2: Previous Expenses & Revenues */}
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>2. المصروفات والإيرادات المرحّلة سلفاً</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">إجمالي المصروفات السابقة (EGP)</label>
                <input type="number" step="0.01" value={expensesEGP} onChange={(e) => setExpensesEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-left" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">إجمالي الإيرادات السابقة (EGP)</label>
                <input type="number" step="0.01" value={revenueEGP} onChange={(e) => setRevenueEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-left" />
              </div>
            </div>
          </div>

          {/* Section 3: Customers & Suppliers Balances */}
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>3. أرصدة ديون العملاء والموردين</span>
            </h3>
            <PartyBalancesList parties={parties} partyBalances={partyBalances} onChange={handlePartyChange} />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-md transition-all">
              <Save className="w-4 h-4" />
              <span>حفظ وترحيل الأرصدة الافتتاحية</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
