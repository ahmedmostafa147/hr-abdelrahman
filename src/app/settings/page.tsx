'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { isSupabaseConfigured } from '@/core/database/supabase';
import { Settings, Database, ShieldCheck, User } from 'lucide-react';

export default function SettingsPage() {
  const supabaseConnected = isSupabaseConfigured();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إعدادات النظام والربط الحسابي</h1>
          <p className="text-xs text-slate-500 mt-1">تكوين قواعد البيانات، المستخدمين، والدورة المحاسبية</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          {/* User Profile */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-base">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">عبدالرحمن الزعيم</h3>
                <p className="text-slate-500">مالك ومدير النظام الكامل (Owner & Admin)</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg font-bold">
              مستخدم نشط فريد
            </span>
          </div>

          {/* Supabase Status */}
          <div className="p-4 rounded-xl border bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-bold text-slate-900">قاعدة بيانات Supabase PostgreSQL</h4>
                <p className="text-[10px] text-slate-500">
                  {supabaseConnected
                    ? 'متصل كلياً مع Supabase Cloud'
                    : 'يعمل بالنظام المحلي الدائم LocalStorage / Memory Fallback'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded font-bold text-[10px] ${
              supabaseConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {supabaseConnected ? 'متصل برمجياً' : 'جاهز للربط بالـ API Keys'}
            </span>
          </div>

          {/* Security Rules */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>قواعد الأمان والرقابة المالية النشارية</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-xl border">
              <li>يمنع تعديل أو حذف القيود المحاسبية بالدفتر العام لمنع أخطاء الحسابات.</li>
              <li>جميع الأموال تُحسب بالقرش مع حظر أعداد الفواصل العشرية (BIGINT Precision).</li>
              <li>جميع أرصدة الخزينة والحسابات تُحسب ديناميكياً من واقع السجل التراكمي (Single Source of Truth).</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
