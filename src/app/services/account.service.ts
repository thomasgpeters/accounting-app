import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // Mock data for testing
  private accounts: Account[] = [
    { id: 1, code: '1000', name: 'Cash', type: 'Asset', balance: 5000, isActive: true },
    { id: 2, code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 3000, isActive: true },
    { id: 3, code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 2000, isActive: true },
    { id: 4, code: '3000', name: 'Owner Equity', type: 'Equity', balance: 10000, isActive: true },
    { id: 5, code: '4000', name: 'Revenue', type: 'Revenue', balance: 15000, isActive: true },
    { id: 6, code: '5000', name: 'Expenses', type: 'Expense', balance: 8000, isActive: true }
  ];

  constructor() { }

  getAccounts(): Observable<Account[]> {
    return of(this.accounts);
  }

  getAccount(id: number): Observable<Account | undefined> {
    return of(this.accounts.find(account => account.id === id));
  }

  createAccount(account: Omit<Account, 'id'>): Observable<Account> {
    const newAccount = {
      ...account,
      id: this.getNextId()
    };
    
    this.accounts.push(newAccount);
    return of(newAccount);
  }

  updateAccount(id: number, account: Partial<Account>): Observable<Account | undefined> {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.accounts[index] = { ...this.accounts[index], ...account };
      return of(this.accounts[index]);
    }
    return of(undefined);
  }

  deleteAccount(id: number): Observable<boolean> {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  private getNextId(): number {
    return Math.max(...this.accounts.map(a => a.id)) + 1;
  }
}