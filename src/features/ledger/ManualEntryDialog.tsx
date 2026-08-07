'use client';

import { useState } from 'react';
import { Account, JournalEntry, JournalEntryLine } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { INITIAL_ACCOUNTS } from '@/core/database/mockData';
import { toPiastres, formatCurrency } from '@/core/utils/currency';
import { BookPlus, Plus, Trash2, X } from 'lucide-react';

interface ManualEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface TempLine {
  accountId: string;
  debitEGP: number;
  creditEGP: number;
  description: string;
}

export default function ManualEntryDialog({ isOpen, onClose, onSaved }: ManualEntryDialogProps) {
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<TempLine[]>([
    { accountId: INITIAL_ACCOUNTS[0].id, debitEGP: 0, creditEGP: 0, description: '' },
    { accountId: INITIAL_ACCOUNTS[1].id, debitEGP: 0, creditEGP: 0, description: '' },
  ]);

  if (!isOpen) return null;

  const totalDebitCents = lines.reduce((acc, l) => acc + toPiastres(l.debitEGP), 0);
  const totalCreditCents = lines.reduce((acc, l) => acc + toPiastres(l.creditEGP), 0);
  const isBalanced = totalDebitCents === totalCreditCents && totalDebitCents > 0;

  const handleAddLine = () => {
    setLines([...lines, { accountId: INITIAL_ACCOUNTS[0].id, debitEGP: 0, creditEGP: 0, description: '' }]);
  };

  const handleRemoveLine = (idx: number) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced || !description.trim()) return;

    const entry: JournalEntry = {
      id: 'je_' + Date.now(),
      entry_number: `JV-MAN-${Date.now().toString().slice(-4)}`,
      entry_date: new Date().toISOString(),
      description,
      status: 'POSTED',
      created_by: 'عبدالرحمن الزعيم',
      lines: lines.map((l) => ({
        account_id: l.accountId,
        debit_cents: toPiastres(l.debitEGP),
        credit_cents: toPiastres(l.creditEGP),
        description: l.description || description,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    ERPStore.addJournalEntry(entry);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-blue-600" />
            <span>إنشاء قيد يومية يدوي (Double-Entry Journal)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">بيان القيد المحاسبي *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: قيد تسوية أرباح وخسائر..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">أطراف القيد (مدين ودائن)</span>
              <button type="button" onClick={handleAddLine} className="text-blue-600 font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> إضافة طرف
              </button>
            </div>

            {lines.map((l, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <select
                  value={l.accountId}
                  onChange={(e) => { const newL = [...lines]; newL[idx].accountId = e.target.value; setLines(newL); }}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                >
                  {INITIAL_ACCOUNTS.map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.code} - {acc.name_ar}</option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  placeholder="مدين EGP"
                  value={l.debitEGP || ''}
                  onChange={(e) => { const newL = [...lines]; newL[idx].debitEGP = parseFloat(e.target.value) || 0; setLines(newL); }}
                  className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded font-bold dir-ltr"
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="دائن EGP"
                  value={l.creditEGP || ''}
                  onChange={(e) => { const newL = [...lines]; newL[idx].creditEGP = parseFloat(e.target.value) || 0; setLines(newL); }}
                  className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded font-bold dir-ltr"
                />

                <button type="button" onClick={() => handleRemoveLine(idx)} className="p-1 text-rose-500 hover:bg-rose-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
            <div>
              <p className="font-bold text-slate-700">إجمالي المدين: <span className="dir-ltr">{formatCurrency(totalDebitCents)}</span></p>
              <p className="font-bold text-slate-700">إجمالي الدائن: <span className="dir-ltr">{formatCurrency(totalCreditCents)}</span></p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-bold ${isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {isBalanced ? 'القيد متزن تماماً ✓' : 'القيد غير متزن (المدين != الدائن)'}
            </span>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">إلغاء</button>
            <button type="submit" disabled={!isBalanced} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold shadow-sm">
              ترحيل القيد للدفتر العام
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
