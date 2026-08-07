'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceWizard from '@/features/sales/InvoiceWizard';
import { ERPStore } from '@/core/database/mockStore';
import { Invoice, Party, Product } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Plus, ShoppingBag, Search } from 'lucide-react';

export default function PurchasesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const loadData = () => {
    setInvoices(ERPStore.getInvoices().filter((i) => i.invoice_type === 'PURCHASE'));
    setParties(ERPStore.getParties());
    setProducts(ERPStore.getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInvoices = invoices.filter((inv) => inv.invoice_number.includes(search));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">فواتير المشتريات (Purchase Invoices)</h1>
            <p className="text-xs text-slate-500 mt-1">توليد فواتير المشتريات وزيادة المخزون بالتزامن مع استحقاقات الموردين</p>
          </div>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>فاتورة شراء جديدة</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث برقم الفاتورة..."
              className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Purchases Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">رقم الفاتورة</th>
                  <th className="p-3.5">المورد</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">صافي المشتريات</th>
                  <th className="p-3.5">المدفوع</th>
                  <th className="p-3.5">المتبقي للمورد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInvoices.map((inv) => {
                  const party = parties.find((p) => p.id === inv.party_id);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900 font-mono flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-purple-600" />
                        <span>{inv.invoice_number}</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{party?.name || 'مورد نقدي'}</td>
                      <td className="p-3.5 text-slate-500">{new Date(inv.issue_date).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3.5 font-bold text-slate-900 dir-ltr">{formatCurrency(inv.net_amount_cents)}</td>
                      <td className="p-3.5 font-bold text-emerald-600 dir-ltr">{formatCurrency(inv.paid_amount_cents)}</td>
                      <td className="p-3.5 font-bold text-rose-600 dir-ltr">{formatCurrency(inv.due_amount_cents)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <InvoiceWizard
        isOpen={isWizardOpen}
        invoiceType="PURCHASE"
        onClose={() => setIsWizardOpen(false)}
        onSaved={loadData}
        parties={parties}
        products={products}
      />
    </DashboardLayout>
  );
}
