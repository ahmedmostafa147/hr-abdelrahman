import { JournalEntry, AccountType } from '../types/database.types';
import { DEFAULT_ACCOUNT_IDS } from '../constants/accounts';

export interface AccountBalanceSummary {
  accountId: string;
  debitCents: number;
  creditCents: number;
  balanceCents: number;
}

/**
 * Single Source of Truth Engine:
 * Computes exact balance for any Account ID directly from Journal Entry Lines.
 */
export function calculateAccountBalance(
  journalEntries: JournalEntry[],
  accountId: string,
  accountType?: AccountType
): AccountBalanceSummary {
  let debitCents = 0;
  let creditCents = 0;

  for (const entry of journalEntries) {
    if (entry.status === 'REVERSED' || entry.deleted_at) continue;

    for (const line of entry.lines || []) {
      if (line.account_id === accountId) {
        debitCents += line.debit_cents || 0;
        creditCents += line.credit_cents || 0;
      }
    }
  }

  // Assets and Expenses have normal Debit balance (Debit - Credit)
  // Liabilities, Equity, and Revenue have normal Credit balance (Credit - Debit)
  const isDebitNormal = accountType === 'ASSET' || accountType === 'EXPENSE';
  const balanceCents = isDebitNormal ? debitCents - creditCents : creditCents - debitCents;

  return { accountId, debitCents, creditCents, balanceCents };
}

/**
 * Single Source of Truth Engine for Parties:
 * Computes net balance for a specific Party ID (Receivables / Payables).
 */
export function calculatePartyBalance(
  journalEntries: JournalEntry[],
  partyId: string
): number {
  let netBalanceCents = 0; // Positive = Customer owes us, Negative = We owe supplier

  for (const entry of journalEntries) {
    if (entry.status === 'REVERSED' || entry.deleted_at) continue;

    for (const line of entry.lines || []) {
      if (line.party_id === partyId) {
        // Debit increases customer indebtedness, Credit decreases it
        netBalanceCents += (line.debit_cents || 0) - (line.credit_cents || 0);
      }
    }
  }

  return netBalanceCents;
}

/**
 * Computes Executive Financial Dashboard KPIs strictly from General Ledger.
 */
export function calculateDashboardMetrics(journalEntries: JournalEntry[]) {
  const cashbox = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.CASH, 'ASSET');
  const bank = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.BANK, 'ASSET');
  const receivables = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.RECEIVABLE, 'ASSET');
  const payables = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.PAYABLE, 'LIABILITY');
  const salesRevenue = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.SALES_REVENUE, 'REVENUE');
  const cogs = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.COGS, 'EXPENSE');
  const generalExpenses = calculateAccountBalance(journalEntries, DEFAULT_ACCOUNT_IDS.GENERAL_EXPENSES, 'EXPENSE');

  const totalExpensesCents = cogs.balanceCents + generalExpenses.balanceCents;
  const netProfitCents = salesRevenue.balanceCents - totalExpensesCents;

  return {
    cashboxBalanceCents: cashbox.balanceCents,
    bankBalanceCents: bank.balanceCents,
    totalLiquidAssetsCents: cashbox.balanceCents + bank.balanceCents,
    totalReceivablesCents: receivables.balanceCents,
    totalPayablesCents: payables.balanceCents,
    totalSalesCents: salesRevenue.balanceCents,
    totalExpensesCents,
    netProfitCents,
  };
}
