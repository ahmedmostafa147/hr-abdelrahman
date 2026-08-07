'use client';

import { useState } from 'react';
import { Party, Product, Invoice, InvoiceType, JournalEntry, JournalEntryLine } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { DEFAULT_ACCOUNT_IDS } from '@/core/constants/accounts';
import { toPiastres, toEGP } from '@/core/utils/currency';
import InvoiceLineItems, { EditableLineItem } from './InvoiceLineItems';
import { ShoppingCart, X } from 'lucide-react';

interface InvoiceWizardProps {
  isOpen: boolean;
  invoiceType: InvoiceType;
  onClose: () => void;
  onSaved: () => void;
  parties: Party[];
  products: Product[];
}

export default function InvoiceWizard({ isOpen, invoiceType, onClose, onSaved, parties, products }: InvoiceWizardProps) {
  const filteredParties = parties.filter((p) =>
    invoiceType.startsWith('SALE') ? p.party_type === 'CUSTOMER' || p.party_type === 'BOTH' : p.party_type === 'SUPPLIER' || p.party_type === 'BOTH'
  );

  const [partyId, setPartyId] = useState(filteredParties[0]?.id || 'p1');
  const [items, setItems] = useState<EditableLineItem[]>([
    { productId: products[0]?.id || 'prod1', quantity: 1, unitPriceEGP: toEGP(products[0]?.selling_price_cents || 0) },
  ]);
  const [paidEGP, setPaidEGP] = useState('');

  if (!isOpen) return null;

  const totalCents = items.reduce((acc, i) => acc + toPiastres(i.quantity * i.unitPriceEGP), 0);
  const paidCents = toPiastres(parseFloat(paidEGP) || 0);
  const dueCents = Math.max(0, totalCents - paidCents);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyId || items.length === 0 || totalCents <= 0) return;

    const invId = 'inv_' + Date.now();
    const jeId = 'je_' + Date.now();
    const isSale = invoiceType === 'SALE';

    const journalLines: JournalEntryLine[] = isSale
      ? [
          { account_id: DEFAULT_ACCOUNT_IDS.RECEIVABLE, party_id: partyId, debit_cents: totalCents, credit_cents: 0, description: 'فاتورة مبيعات' },
          { account_id: DEFAULT_ACCOUNT_IDS.SALES_REVENUE, debit_cents: 0, credit_cents: totalCents, description: 'إيراد مبيعات' },
        ]
      : [
          { account_id: DEFAULT_ACCOUNT_IDS.INVENTORY, debit_cents: totalCents, credit_cents: 0, description: 'فاتورة مشتريات' },
          { account_id: DEFAULT_ACCOUNT_IDS.PAYABLE, party_id: partyId, debit_cents: 0, credit_cents: totalCents, description: 'استحقاق مورد' },
        ];

    if (paidCents > 0 && isSale) {
      journalLines.push(
        { account_id: DEFAULT_ACCOUNT_IDS.CASH, debit_cents: paidCents, credit_cents: 0, description: 'دفعة نقدية فورية' },
        { account_id: DEFAULT_ACCOUNT_IDS.RECEIVABLE, party_id: partyId, debit_cents: 0, credit_cents: paidCents, description: 'تسوية دفعة الفاتورة' }
      );
    }

    ERPStore.addJournalEntry({
      id: jeId,
      entry_number: `JV-INV-${Date.now().toString().slice(-4)}`,
      entry_date: new Date().toISOString(),
      description: `قيد فاتورة ${isSale ? 'مبيعات' : 'مشتريات'} رقم ${invId}`,
      status: 'POSTED',
      lines: journalLines,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    ERPStore.saveInvoice({
      id: invId,
      invoice_number: `${isSale ? 'INV' : 'PUR'}-${Date.now().toString().slice(-4)}`,
      invoice_type: invoiceType,
      party_id: partyId,
      status: 'POSTED',
      total_amount_cents: totalCents,
      tax_amount_cents: 0,
      discount_amount_cents: 0,
      net_amount_cents: totalCents,
      paid_amount_cents: paidCents,
      due_amount_cents: dueCents,
      issue_date: new Date().toISOString(),
      journal_entry_id: jeId,
      items: items.map((it) => ({
        product_id: it.productId,
        quantity: it.quantity,
        unit_price_cents: toPiastres(it.unitPriceEGP),
        total_price_cents: toPiastres(it.quantity * it.unitPriceEGP),
        avg_cost_cents: toPiastres(it.unitPriceEGP),
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>إنشاء فاتورة {invoiceType === 'SALE' ? 'بيع' : 'شراء'} جديدة</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">الطرف (العميل / المورد) *</label>
            <select value={partyId} onChange={(e) => setPartyId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
              {filteredParties.map((p) => (<option key={p.id} value={p.id}>{p.name} ({p.code})</option>))}
            </select>
          </div>

          <InvoiceLineItems products={products} items={items} onChange={setItems} />

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">المدفوع نقدًا (EGP)</label>
              <input type="number" step="0.01" value={paidEGP} onChange={(e) => setPaidEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-bold dir-ltr" />
            </div>
            <div className="text-left font-bold space-y-1">
              <p className="text-slate-500">الإجمالي: <span className="text-slate-900">{toEGP(totalCents)} ج.م</span></p>
              <p className="text-rose-600">المتبقي: <span className="text-rose-700">{toEGP(dueCents)} ج.م</span></p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">إلغاء</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm">
              اعتماد الفاتورة وترحيل القيد المحاسبي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
