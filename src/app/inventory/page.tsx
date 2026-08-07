'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ERPStore } from '@/core/database/mockStore';
import { Product, Invoice } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Boxes, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setProducts(ERPStore.getProducts());
    setInvoices(ERPStore.getInvoices());
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">سجل وحركات المخزون (Stock Movements)</h1>
          <p className="text-xs text-slate-500 mt-1">تتبع الوارد والمنصرف وقيمة المخزون بتقييم متوسط التكلفة WAC</p>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">المنتج</th>
                  <th className="p-3.5">سعر الشراء الحالي</th>
                  <th className="p-3.5">متوسط التكلفة WAC</th>
                  <th className="p-3.5">الحد الأدنى بالتنبيهات</th>
                  <th className="p-3.5">حالة الرصيد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-blue-600" />
                      <span>{prod.name} ({prod.code})</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-700 dir-ltr">{formatCurrency(prod.purchase_price_cents)}</td>
                    <td className="p-3.5 font-bold text-purple-700 dir-ltr">{formatCurrency(prod.avg_cost_cents)}</td>
                    <td className="p-3.5 font-bold text-slate-600">{prod.min_stock_alert} {prod.unit}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        متوفر ومستقر
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
