import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JournalEntry, JournalEntryLine } from '../models/journal-entry.model';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {
  // Mock data for testing
  private journalEntries: JournalEntry[] = [
    {
      id: 1,
      entryDate: '2025-05-15',
      referenceNumber: 'JE-001',
      description: 'Initial customer payment',
      isPosted: true,
      lines: [
        { id: 1, accountId: 1, accountCode: '1000', accountName: 'Cash', debitAmount: 1000, creditAmount: 0 },
        { id: 2, accountId: 2, accountCode: '1200', accountName: 'Accounts Receivable', debitAmount: 0, creditAmount: 1000 }
      ],
      total: 1000
    },
    {
      id: 2,
      entryDate: '2025-05-16',
      referenceNumber: 'JE-002',
      description: 'Office supplies purchase',
      isPosted: true,
      lines: [
        { id: 3, accountId: 6, accountCode: '5000', accountName: 'Expenses', debitAmount: 250, creditAmount: 0 },
        { id: 4, accountId: 1, accountCode: '1000', accountName: 'Cash', debitAmount: 0, creditAmount: 250 }
      ],
      total: 250
    },
    {
      id: 3,
      entryDate: '2025-05-16',
      referenceNumber: 'JE-003',
      description: 'Client invoice',
      isPosted: false,
      lines: [
        { id: 5, accountId: 2, accountCode: '1200', accountName: 'Accounts Receivable', debitAmount: 1500, creditAmount: 0 },
        { id: 6, accountId: 5, accountCode: '4000', accountName: 'Revenue', debitAmount: 0, creditAmount: 1500 }
      ],
      total: 1500
    }
  ];

  constructor(private accountService: AccountService) { }

  getJournalEntries(): Observable<JournalEntry[]> {
    return of(this.journalEntries);
  }

  getJournalEntry(id: number): Observable<JournalEntry | undefined> {
    return of(this.journalEntries.find(entry => entry.id === id));
  }

  createJournalEntry(entry: Omit<JournalEntry, 'id'>): Observable<JournalEntry> {
    // In a real app, this would be where we'd calculate totals from lines, check for balance, etc.
    const newEntry = {
      ...entry,
      id: this.getNextId(),
      total: entry.lines.reduce((sum, line) => sum + line.debitAmount, 0)
    };
    
    // Assign line IDs
    newEntry.lines = newEntry.lines.map((line, index) => ({
      ...line,
      id: this.getNextLineId() + index
    }));
    
    this.journalEntries.push(newEntry);
    return of(newEntry);
  }

  updateJournalEntry(id: number, entry: Partial<JournalEntry>): Observable<JournalEntry | undefined> {
    const index = this.journalEntries.findIndex(je => je.id === id);
    if (index !== -1) {
      // Calculate total from lines if they're included
      let total = this.journalEntries[index].total;
      if (entry.lines) {
        total = entry.lines.reduce((sum, line) => sum + line.debitAmount, 0);
      }
      
      this.journalEntries[index] = { 
        ...this.journalEntries[index], 
        ...entry,
        total
      };
      return of(this.journalEntries[index]);
    }
    return of(undefined);
  }

  postJournalEntry(id: number): Observable<JournalEntry | undefined> {
    return this.updateJournalEntry(id, { isPosted: true });
  }

  deleteJournalEntry(id: number): Observable<boolean> {
    const index = this.journalEntries.findIndex(je => je.id === id);
    if (index !== -1) {
      this.journalEntries.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  private getNextId(): number {
    return Math.max(...this.journalEntries.map(je => je.id)) + 1;
  }

  private getNextLineId(): number {
    return Math.max(...this.journalEntries.flatMap(je => je.lines.map(line => line.id))) + 1;
  }
}
