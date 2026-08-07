'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  Receipt,
  BookOpen,
  FileBarChart,
  ShieldCheck,
  Settings,
  Building2
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/parties', label: 'العملاء والموردين', icon: Users },
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
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen border-l border-slate-800 shadow-xl">
      <div className="p-5 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-slate-50">الزعيم ERP</h1>
          <p className="text-xs text-blue-400 font-medium">عبدالرحمن الزعيم</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 text-center">
        الإصدار 1.0.0 — قيد مزدوج محمي
      </div>
    </aside>
  );
}
