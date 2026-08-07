"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

interface PageGuideProps {
  title: string;
  description: string;
  points?: string[];
  defaultOpen?: boolean;
}

export default function PageGuide({
  title,
  description,
  points = [],
  defaultOpen = true,
}: PageGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 text-xs transition-all">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700 border border-slate-200">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>شرح الدورة المحاسبية: {title}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-1">
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {isOpen && points.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-slate-600">
          <p className="font-bold text-[11px] text-slate-800">
            كيف تعمل هذه الشاشة وما الذي يحدث بالدفتر العام؟
          </p>
          <ul className="space-y-1 list-disc list-inside text-[11px]">
            {points.map((pt, idx) => (
              <li key={idx} className="leading-relaxed">
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
