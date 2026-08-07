'use client';

import { useState } from 'react';
import { CashboxBank, JournalEntry } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { DEFAULT_ACCOUNT_IDS } from '@/core/constants/accounts';
import { toPiastres } from '@/core/utils/currency';
import { Receipt, X } from 'lucide-react';

interface ExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  cashboxes: CashboxBank[];
}

const EXPENSE_CATEGORIES = [
  'إيجار المحل / المقر',
  'كهرباء ومياه وغاز',
  'نقل وشحن ومواصلات',
  'رواتب وأجور العاملين',
  'وقود وصيانة سيارات',
  'أدوات مكتبية ونثرية',
];

export default function ExpenseDialog({ isOpen, onClose, onSaved, cashboxes }: ExpenseDialogProps) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amountEGP, setAmountEGP] = useState('');
  const [cashboxId, setCashboxId] = useState(cashboxes[0]?.id || 'cb1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = toPiastres(parseFloat(amountEGP));
    if (amountCents <= 0) return;

    const chosenBox = cashboxes.find((c) => c.id === cashboxId) || cashboxes[0];

    // DR Expenses (6100), CR Cash Account
    const entry: JournalEntry = {
      id: 'je_' + Date.now(),
      entry_number: `JV-EXP-${Date.now().toString().slice(-4)}`,
      entry_date: new Date().toISOString(),
      description: `مصروف: ${category} - ${notes}`,
      status: 'POSTED',
      created_by: 'عبدالرحمن الزعيم',
      lines: [
        { account_id: DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES, debit_cents: amountCents, credit_cents: 0, description: category },
        { account_id: chosenBox.balance_account_id, debit_cents: 0, credit_cents: amountCents, description: `خصم مصروف من ${chosenBox.name}` },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    ERPStore.addJournalEntry(entry);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-600" />
            <span>تسجيل مصروف تشغيلي جديد</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">بند المصروف *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">المبلغ (EGP) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={amountEGP}
              onChange={(e) => setAmountEGP(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold dir-ltr"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">الدفع من (الخزينة / البنك)</label>
            <select value={cashboxId} onChange={(e) => setCashboxId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              {cashboxes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">تفاصيل / ملاحظات</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="رقم الفاتورة أو البيان..." className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">إلغاء</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-sm">
              ترحيل قيد المصروف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
