'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserCheck, Truck, Scale, Package, Boxes,
  ShoppingCart, ShoppingBag, Wallet, Receipt, BookOpen,
  FileBarChart, ShieldCheck, Settings, Building2
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/customers', label: 'العملاء', icon: UserCheck },
  { href: '/suppliers', label: 'الموردين', icon: Truck },
  { href: '/opening-balances', label: 'الأرصدة الافتتاحية', icon: Scale },
  { href: '/products', label: 'المنتجات والأصناف', icon: Package },
  { href: '/inventory', label: 'حركات المخزن', icon: Boxes },
  { href: '/sales', label: 'فواتير المبيعات', icon: ShoppingCart },
  { href: '/purchases', label: 'فواتير المشتريات', icon: ShoppingBag },
  { href: '/cashbox', label: 'الخزينة والبنك', icon: Wallet },
  { href: '/expenses', label: 'المصروفات', icon: Receipt },
  { href: '/ledger', label: 'الدفتر العام (GL)', icon: BookOpen },
  { href: '/reports', label: 'التقارير المالية', icon: FileBarChart },
  { href: '/audit', label: 'سجل العمليات', icon: ShieldCheck },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white text-slate-700 flex flex-col min-h-screen border-l border-slate-200 shadow-sm">
      <div className="p-4 flex items-center gap-3 border-b border-slate-200">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-800">الزعيم ERP</h1>
          <p className="text-[10px] text-slate-400">عبدالرحمن الزعيم</p>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 text-[10px] text-slate-400 text-center">
        الإصدار 1.0.0 — قيد مزدوج محمي
      </div>
    </aside>
  );
}
