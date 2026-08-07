'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ERPStore } from '@/core/database/mockStore';
import { AuditLog } from '@/core/types/database.types';
import { ShieldCheck, Clock } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setLogs(ERPStore.getAuditLogs());
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">سجل التتبع والرقابة (Audit Log)</h1>
          <p className="text-xs text-slate-500 mt-1">تتبع غير قابل للتعديل لكافة العمليات المنفذة في النظام لحماية البيانات</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">الجدول والمُعَرّف</th>
                  <th className="p-3.5">نوع العملية</th>
                  <th className="p-3.5">بواسطة</th>
                  <th className="p-3.5">التاريخ والوقت</th>
                  <th className="p-3.5">البيانات الجديدة المسجلة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">لا توجد سجلات تتبع حالياً</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold font-mono text-slate-900">
                        {log.table_name} ({log.record_id.slice(0, 8)}...)
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'INSERT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{log.performed_by}</span>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[10px]">
                        <Clock className="w-3 h-3 inline ml-1 text-slate-400" />
                        {new Date(log.created_at).toLocaleString('ar-EG')}
                      </td>
                      <td className="p-3.5 font-mono text-[10px] text-slate-600 max-w-xs truncate dir-ltr">
                        {JSON.stringify(log.new_data || {})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
