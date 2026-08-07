import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/core/utils/currency';

interface MetricCardProps {
  title: string;
  amountCents: number;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  subtitle?: string;
}

const variantStyles = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function MetricCard({
  title,
  amountCents,
  icon: Icon,
  variant = 'blue',
  subtitle,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-lg border ${variantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatCurrency(amountCents)}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
