"use client";

import { Product } from "@/core/types/database.types";
import { AlertTriangle, PackageX } from "lucide-react";
import Link from "next/link";

interface StockAlertsProps {
  products: Product[];
}

export default function StockAlerts({ products }: StockAlertsProps) {
  // Demo simulation of stock levels relative to min threshold
  const lowStockItems = products.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs bg-amber-50/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>تنبيهات المخزون الحرجة</span>
        </h3>
        <Link
          href="/products"
          className="text-xs text-amber-700 font-semibold hover:underline"
        >
          عرض المنتجات
        </Link>
      </div>

      <div className="space-y-2">
        {lowStockItems.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">
            المخزون بوضع جيد جداً
          </p>
        ) : (
          lowStockItems.map((prod) => (
            <div
              key={prod.id}
              className="flex items-center justify-between p-2.5 bg-white border border-amber-100 rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <PackageX className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {prod.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    حد التنبيه: {prod.min_stock_alert} {prod.unit}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                طلب توريد عاجل
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
