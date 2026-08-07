'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductDialog from '@/features/products/ProductDialog';
import { ERPStore } from '@/core/database/mockStore';
import { Product } from '@/core/types/database.types';
import { formatCurrency } from '@/core/utils/currency';
import { Plus, Package, Search, Barcode, Edit3 } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadData = () => {
    setProducts(ERPStore.getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.name.includes(search) || p.code.includes(search) || (p.barcode && p.barcode.includes(search))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">دليل المنتجات والأصناف</h1>
            <p className="text-xs text-slate-500 mt-1">إدارة قائمة المنتجات، الباركود، ومتوسط التكلفة WAC</p>
          </div>
          <button
            onClick={() => { setSelectedProduct(null); setIsDialogOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم المنتج، الباركود، أو الكود..."
              className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">كود واسم المنتج</th>
                  <th className="p-3.5">الباركود</th>
                  <th className="p-3.5">الوحدة</th>
                  <th className="p-3.5">سعر الشراء</th>
                  <th className="p-3.5">متوسط التكلفة WAC</th>
                  <th className="p-3.5">سعر البيع</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{p.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        <Barcode className="w-3 h-3 text-slate-400" /> {p.barcode || '-'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{p.unit}</td>
                    <td className="p-3.5 font-bold text-slate-700 dir-ltr">{formatCurrency(p.purchase_price_cents)}</td>
                    <td className="p-3.5 font-bold text-purple-700 dir-ltr">{formatCurrency(p.avg_cost_cents)}</td>
                    <td className="p-3.5 font-bold text-emerald-600 dir-ltr">{formatCurrency(p.selling_price_cents)}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => { setSelectedProduct(p); setIsDialogOpen(true); }}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSaved={loadData} initialProduct={selectedProduct} />
    </DashboardLayout>
  );
}
