'use client';

import { useState } from 'react';
import { Product } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { toPiastres, toEGP } from '@/core/utils/currency';
import { PackagePlus, X } from 'lucide-react';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialProduct?: Product | null;
}

const PLASTIC_UNITS = ['كجم (Kg)', 'طن (Ton)', 'باكت (Pack)', 'كرتونة', 'رول بلاستيك', 'ألف كيس'];

export default function ProductDialog({ isOpen, onClose, onSaved, initialProduct }: ProductDialogProps) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [barcode, setBarcode] = useState(initialProduct?.barcode || '');
  const [unit, setUnit] = useState(initialProduct?.unit || 'كجم (Kg)');
  const [purchasePriceEGP, setPurchasePriceEGP] = useState(initialProduct ? toEGP(initialProduct.purchase_price_cents).toString() : '');
  const [sellingPriceEGP, setSellingPriceEGP] = useState(initialProduct ? toEGP(initialProduct.selling_price_cents).toString() : '');
  const [minStockAlert, setMinStockAlert] = useState(initialProduct?.min_stock_alert?.toString() || '100');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const pPrice = toPiastres(parseFloat(purchasePriceEGP) || 0);
    const sPrice = toPiastres(parseFloat(sellingPriceEGP) || 0);

    const product: Product = {
      id: initialProduct?.id || 'prod_' + Date.now(),
      code: initialProduct?.code || 'BAG-' + Math.floor(100 + Math.random() * 900),
      barcode: barcode || Math.floor(6220000000000 + Math.random() * 9000000000).toString(),
      name,
      unit,
      purchase_price_cents: pPrice,
      selling_price_cents: sPrice,
      avg_cost_cents: initialProduct?.avg_cost_cents || pPrice,
      min_stock_alert: parseInt(minStockAlert) || 100,
      created_at: initialProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    ERPStore.saveProduct(product);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-blue-600" />
            <span>{initialProduct ? 'تعديل بيانات المنتج' : 'إضافة صنف أكياس / شنط جديد'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">اسم صنف البلاستيك *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شنط تسوق مقاس 40 HDPE / أكياس قمامة 70x90"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">الباركود</label>
              <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="622..." className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">وحدة القياس *</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold">
                {PLASTIC_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">سعر الشراء / التكلفة (EGP)</label>
              <input type="number" step="0.01" required value={purchasePriceEGP} onChange={(e) => setPurchasePriceEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold dir-ltr" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">سعر البيع للجملة (EGP)</label>
              <input type="number" step="0.01" required value={sellingPriceEGP} onChange={(e) => setSellingPriceEGP(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold dir-ltr" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">حد التنبيه الأدنى للمخزون</label>
            <input type="number" value={minStockAlert} onChange={(e) => setMinStockAlert(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold">إلغاء</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm">
              حفظ المنتج
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
