'use client';

import { useState } from 'react';
import { Party, CashboxBank, JournalEntry } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { DEFAULT_ACCOUNT_IDS } from '@/core/constants/accounts';
import { toPiastres } from '@/core/utils/currency';
import { DollarSign, X } from 'lucide-react';

interface PartyPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  party: Party;
  cashboxes: CashboxBank[];
}

export default function PartyPaymentDialog({ isOpen, onClose, onSaved, party, cashboxes }: PartyPaymentDialogProps) {
  const [transactionType, setTransactionType] = useState<'RECEIPT' | 'PAYMENT'>('RECEIPT');
  const [amountEGP, setAmountEGP] = useState('');
  const [selectedCashboxId, setSelectedCashboxId] = useState(cashboxes[0]?.id || 'cb1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = toPiastres(parseFloat(amountEGP));
    if (amountCents <= 0) return;

    const chosenCashbox = cashboxes.find(c => c.id === selectedCashboxId) || cashboxes[0];
    const cashAccount = chosenCashbox?.balance_account_id || DEFAULT_ACCOUNT_IDS.CASH;
    const isReceipt = transactionType === 'RECEIPT';

    // RECEIPT (تحصيل من عميل): DR Cash, CR Customer AR
    // PAYMENT (دفع لمورد): DR Supplier AP, CR Cash
    const entry: JournalEntry = {
      id: 'je_' + Date.now(),
      entry_number: `JV-REC-${Date.now().toString().slice(-4)}`,
      entry_date: new Date().toISOString(),
      description: isReceipt
        ? `تحصيل نقدًا من الطرف ${party.name} - ${notes}`
        : `سداد نقدًا للطرف ${party.name} - ${notes}`,
      status: 'POSTED',
      created_by: 'عبدالرحمن الزعيم',
      lines: isReceipt
        ? [
            { account_id: cashAccount, debit_cents: amountCents, credit_cents: 0, description: 'تحصيل نقدًا' },
            { account_id: DEFAULT_ACCOUNT_IDS.RECEIVABLE, party_id: party.id, debit_cents: 0, credit_cents: amountCents, description: 'تسوية مديونية العميل' }
          ]
        : [
            { account_id: DEFAULT_ACCOUNT_IDS.PAYABLE, party_id: party.id, debit_cents: amountCents, credit_cents: 0, description: 'تسوية مديونية المورد' },
            { account_id: cashAccount, debit_cents: 0, credit_cents: amountCents, description: 'صرف نقدًا' }
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
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>تسجيل حركة قبض / صرف حقيقية</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">نوع الحركة</label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransactionType('RECEIPT')}
                className={`py-2 rounded-lg font-bold border transition-all ${
                  transactionType === 'RECEIPT'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                تحصيل من عميل (قبض)
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('PAYMENT')}
                className={`py-2 rounded-lg font-bold border transition-all ${
                  transactionType === 'PAYMENT'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                دفع لمورد (صرف)
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">الطرف</label>
            <input type="text" readOnly value={party.name} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold" />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">المبلغ (بالجنيه المصري) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={amountEGP}
              onChange={(e) => setAmountEGP(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold dir-ltr"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">الحساب المالي (الخزينة / البنك)</label>

            <select
              value={selectedCashboxId}
              onChange={(e) => setSelectedCashboxId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {cashboxes.map((cb) => (
                <option key={cb.id} value={cb.id}>{cb.name} ({cb.type === 'CASH' ? 'خزينة' : 'بنك'})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">ملاحظات / بيان القيد</label>

            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: دفعة تحت حساب الفاتورة..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">إلغاء</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm">
              ترحيل القيد المالي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
