export interface JournalEntryLine {
  id: number;
  accountId: number;
  accountCode?: string;
  accountName?: string;
  description?: string;
  debitAmount: number;
  creditAmount: number;
}

export interface JournalEntry {
  id: number;
  entryDate: string;
  referenceNumber?: string;
  description: string;
  isPosted: boolean;
  lines: JournalEntryLine[];
  total: number;
}