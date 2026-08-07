'use client';

import { Product } from '@/core/types/database.types';
import { formatCurrency, toEGP, toPiastres } from '@/core/utils/currency';
import { Trash2, Plus } from 'lucide-react';

export interface EditableLineItem {
  productId: string;
  quantity: number;
  unitPriceEGP: number;
}

interface InvoiceLineItemsProps {
  products: Product[];
  items: EditableLineItem[];
  onChange: (items: EditableLineItem[]) => void;
}

export default function InvoiceLineItems({ products, items, onChange }: InvoiceLineItemsProps) {
  const handleAddItem = () => {
    if (products.length === 0) return;
    const defaultProd = products[0];
    onChange([...items, { productId: defaultProd.id, quantity: 1, unitPriceEGP: toEGP(defaultProd.selling_price_cents) }]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof EditableLineItem, value: any) => {
    const newItems = [...items];
    if (field === 'productId') {
      const selectedProd = products.find((p) => p.id === value);
      if (selectedProd) {
        newItems[index] = {
          productId: value,
          quantity: newItems[index].quantity,
          unitPriceEGP: toEGP(selectedProd.selling_price_cents),
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-800 text-xs">بنود الفاتورة والمنتجات</h4>
        <button
          type="button"
          onClick={handleAddItem}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> إضافة بند
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const lineTotalCents = toPiastres(item.quantity * item.unitPriceEGP);
          return (
            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <select
                value={item.productId}
                onChange={(e) => handleUpdateItem(idx, 'productId', e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.selling_price_cents)})</option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleUpdateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded text-center font-bold"
              />

              <input
                type="number"
                step="0.01"
                value={item.unitPriceEGP}
                onChange={(e) => handleUpdateItem(idx, 'unitPriceEGP', parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded font-bold dir-ltr"
              />

              <span className="w-28 font-bold text-emerald-600 text-left dir-ltr">
                {formatCurrency(lineTotalCents)}
              </span>

              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
