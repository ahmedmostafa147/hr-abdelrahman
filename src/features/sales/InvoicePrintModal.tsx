'use client';

import { Invoice, Party } from '@/core/types/database.types';
import { formatCurrency, toEGP } from '@/core/utils/currency';
import { Printer, Share2, X, Building2 } from 'lucide-react';

interface InvoicePrintModalProps {
  isOpen: boolean;
  invoice: Invoice;
  party?: Party;
  onClose: () => void;
}

export default function InvoicePrintModal({ isOpen, invoice, party, onClose }: InvoicePrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `فاتورة ضريبية من الزعيم ERP%0Aرقم الفاتورة: ${invoice.invoice_number}%0Aالعميل: ${party?.name}%0Aالإجمالي: ${toEGP(invoice.net_amount_cents)} ج.م%0Aشكراً لتعاملكم معنا!`;
    const phone = party?.phone ? party.phone.replace(/[^0-9]/g, '') : '';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 printable-area">
        {/* Printable Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">مؤسسة عبدالرحمن الزعيم التجارية</h2>
              <p className="text-[10px] text-slate-500">فاتورة مبيعات ضريبية متكاملة</p>
            </div>
          </div>
          <div className="text-left font-mono">
            <p className="font-bold text-slate-900 text-sm">{invoice.invoice_number}</p>
            <p className="text-[10px] text-slate-400">{new Date(invoice.issue_date).toLocaleDateString('ar-EG')}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="my-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-500 block">بيانات العميل / الطرف:</span>
            <span className="font-bold text-slate-900">{party?.name || 'عميل نقدي'}</span>
            <span className="text-[10px] text-slate-400 block">{party?.address || '-'}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-500 block">حالة التسديد:</span>
            <span className="font-bold text-emerald-600">
              {invoice.due_amount_cents === 0 ? 'مسددة بالكامل' : `متبقي: ${formatCurrency(invoice.due_amount_cents)}`}
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-right text-xs my-4">
          <thead className="bg-slate-100 font-bold border-y border-slate-200">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">البيان</th>
              <th className="p-2">الكمية</th>
              <th className="p-2">السعر</th>
              <th className="p-2 text-left">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(invoice.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 text-slate-400">{idx + 1}</td>
                <td className="p-2 font-bold text-slate-800">صنف مبيعات #{idx + 1}</td>
                <td className="p-2 font-bold">{item.quantity}</td>
                <td className="p-2 dir-ltr">{formatCurrency(item.unit_price_cents)}</td>
                <td className="p-2 font-bold text-left dir-ltr">{formatCurrency(item.total_price_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="text-slate-500">شكراً لتعاملكم مع مؤسسة عبدالرحمن الزعيم</div>
          <div className="text-left font-bold space-y-1">
            <p className="text-base text-slate-900">الإجمالي: {formatCurrency(invoice.net_amount_cents)}</p>
          </div>
        </div>

        {/* Action Buttons (Non Printable) */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2 no-print">
          <button onClick={onClose} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs">إغلاق</button>
          <button onClick={handleWhatsAppShare} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs">
            <Share2 className="w-3.5 h-3.5" /> مشاركة واتساب
          </button>
          <button onClick={handlePrint} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs">
            <Printer className="w-3.5 h-3.5" /> طباعة الفاتورة
          </button>
        </div>
      </div>
    </div>
  );
}
