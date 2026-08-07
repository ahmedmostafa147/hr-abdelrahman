'use client';

import { Party, JournalEntryLine } from '@/core/types/database.types';
import { DEFAULT_ACCOUNT_IDS } from '@/core/constants/accounts';
import { toPiastres } from '@/core/utils/currency';
import { ERPStore } from '@/core/database/mockStore';

interface BalanceData {
  cashEGP: number;
  bankEGP: number;
  expensesEGP: number;
  revenueEGP: number;
  partyBalances: Record<string, number>;
}

export function submitOpeningBalances(data: BalanceData, parties: Party[]) {
  const lines: JournalEntryLine[] = [];
  let totalDebit = 0;
  let totalCredit = 0;

  const addLine = (accountId: string, debit: number, credit: number, desc: string, partyId?: string) => {
    if (debit > 0 || credit > 0) {
      lines.push({ account_id: accountId, debit_cents: debit, credit_cents: credit, description: desc, ...(partyId && { party_id: partyId }) });
      totalDebit += debit;
      totalCredit += credit;
    }
  };

  // Cash & Bank (Assets = Debit)
  addLine(DEFAULT_ACCOUNT_IDS.CASH, toPiastres(data.cashEGP), 0, 'رصيد الخزينة الافتتاحي');
  addLine(DEFAULT_ACCOUNT_IDS.BANK, toPiastres(data.bankEGP), 0, 'رصيد البنك الافتتاحي');

  // Expenses (Debit balance)
  addLine(DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES, toPiastres(data.expensesEGP), 0, 'إجمالي المصروفات السابقة المرحّلة');

  // Revenue (Credit balance)
  addLine(DEFAULT_ACCOUNT_IDS.SALES_REVENUE, 0, toPiastres(data.revenueEGP), 'إجمالي الإيرادات السابقة المرحّلة');

  // Customer AR (Debit) & Supplier AP (Credit)
  parties.forEach((p) => {
    const valCents = toPiastres(data.partyBalances[p.id] || 0);
    if (valCents > 0) {
      if (p.party_type === 'CUSTOMER' || p.party_type === 'BOTH') {
        addLine(DEFAULT_ACCOUNT_IDS.RECEIVABLE, valCents, 0, `رصيد أول المدة لـ ${p.name}`, p.id);
      } else {
        addLine(DEFAULT_ACCOUNT_IDS.PAYABLE, 0, valCents, `رصيد أول المدة لـ ${p.name}`, p.id);
      }
    }
  });

  // Balance with Capital
  const net = totalDebit - totalCredit;
  if (net > 0) addLine(DEFAULT_ACCOUNT_IDS.CAPITAL, 0, net, 'موازنة الأرصدة الافتتاحية برأس المال');
  else if (net < 0) addLine(DEFAULT_ACCOUNT_IDS.CAPITAL, Math.abs(net), 0, 'موازنة الأرصدة الافتتاحية برأس المال');

  ERPStore.addJournalEntry({
    id: 'je_open_' + Date.now(), entry_number: 'JV-OPEN-001',
    entry_date: new Date().toISOString(), description: 'قيد إثبات الأرصدة الافتتاحية وأول المدة',
    status: 'POSTED', created_by: 'عبدالرحمن الزعيم', lines,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  });
}
