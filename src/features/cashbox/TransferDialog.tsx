'use client';

import { useState } from 'react';
import { CashboxBank, JournalEntry } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { toPiastres } from '@/core/utils/currency';
import { ArrowLeftRight, X } from 'lucide-react';

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  cashboxes: CashboxBank[];
}

export default function TransferDialog({ isOpen, onClose, onSaved, cashboxes }: TransferDialogProps) {
  const [fromId, setFromId] = useState(cashboxes[0]?.id || 'cb1');
  const [toId, setToId] = useState(cashboxes[1]?.id || 'cb2');
  const [amountEGP, setAmountEGP] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = toPiastres(parseFloat(amountEGP));
    if (amountCents <= 0 || fromId === toId) return;

    const fromBox = cashboxes.find((c) => c.id === fromId)!;
    const toBox = cashboxes.find((c) => c.id === toId)!;

    // DR Destination Account, CR Source Account
    const entry: JournalEntry = {
      id: 'je_' + Date.now(),
      entry_number: `JV-TRF-${Date.now().toString().slice(-4)}`,
      entry_date: new Date().toISOString(),
      description: `تحويل نقدية بين ${fromBox.name} وإلى ${toBox.name} - ${notes}`,
      status: 'POSTED',
      created_by: 'عبدالرحمن الزعيم',
      lines: [
        { account_id: toBox.balance_account_id, debit_cents: amountCents, credit_cents: 0, description: `استلام تحويل في ${toBox.name}` },
        { account_id: fromBox.balance_account_id, debit_cents: 0, credit_cents: amountCents, description: `خصم تحويل من ${fromBox.name}` },
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
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            <span>تحويل أموال بين الخزينة والبنك</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">من حساب (المصدر) *</label>
            <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              {cashboxes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">إلى حساب (الوجهة) *</label>
            <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              {cashboxes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">المبلغ المحول (EGP) *</label>
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
            <label className="font-semibold text-slate-700 block mb-1">البيان / السبب</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثال: إيداع حصيلة اليوم في البنك" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">إلغاء</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm">
              ترحيل قيد التحويل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
