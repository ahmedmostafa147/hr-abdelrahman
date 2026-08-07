'use client';

import { useState } from 'react';
import { Party, PartyType } from '@/core/types/database.types';
import { ERPStore } from '@/core/database/mockStore';
import { UserPlus, X } from 'lucide-react';

interface PartyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialParty?: Party | null;
}

export default function PartyDialog({ isOpen, onClose, onSaved, initialParty }: PartyDialogProps) {
  const [name, setName] = useState(initialParty?.name || '');
  const [partyType, setPartyType] = useState<PartyType>(initialParty?.party_type || 'CUSTOMER');
  const [phone, setPhone] = useState(initialParty?.phone || '');
  const [email, setEmail] = useState(initialParty?.email || '');
  const [address, setAddress] = useState(initialParty?.address || '');
  const [taxNumber, setTaxNumber] = useState(initialParty?.tax_number || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const party: Party = {
      id: initialParty?.id || 'party_' + Date.now(),
      code: initialParty?.code || (partyType === 'CUSTOMER' ? 'CUST-' : partyType === 'SUPPLIER' ? 'SUPP-' : 'BOTH-') + Math.floor(100 + Math.random() * 900),
      name,
      party_type: partyType,
      phone,
      email,
      address,
      tax_number: taxNumber,
      created_at: initialParty?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    ERPStore.saveParty(party);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>{initialParty ? 'تعديل بيانات طرف' : 'إضافة عميل / مورد جديد'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شركة الأمل للتجارة"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">صفة التعامل *</label>
            <select
              value={partyType}
              onChange={(e) => setPartyType(e.target.value as PartyType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="CUSTOMER">عميل فقط</option>
              <option value="SUPPLIER">مورد فقط</option>
              <option value="BOTH">عميل ومورد معا (Dual Role)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010xxxxxxx"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">الرقم الضريبي</label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="123-456-789"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">العنوان</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold">
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm">
              حفظ الطرف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
