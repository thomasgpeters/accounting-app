import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';
import { Account } from '../models/account.model';

export interface ReportItem {
  code: string;
  name: string;
  balance: number;
  type: string;
  isTotal?: boolean;
  isHeader?: boolean;
  indent?: number;
  creditBalance?: number; // Add this property
}
export interface FinancialReport {
  title: string;
  subtitle: string;
  date: string;
  sections: {
    title: string;
    items: ReportItem[];
    total?: number;
  }[];
  totals?: {
    label: string;
    value: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private accountService: AccountService) { }

  getIncomeStatement(): Observable<FinancialReport> {
    return this.accountService.getAccounts().pipe(
      map(accounts => {
        const revenues = this.getAccountsByType(accounts, 'Revenue');
        const expenses = this.getAccountsByType(accounts, 'Expense');
        
        const revenueTotal = this.sumAccountBalances(revenues);
        const expenseTotal = this.sumAccountBalances(expenses);
        const netIncome = revenueTotal - expenseTotal;
        
        return {
          title: 'Income Statement',
          subtitle: 'For the Period Ended',
          date: new Date().toLocaleDateString(),
          sections: [
            {
              title: 'Revenue',
              items: [
                ...revenues.map(account => this.accountToReportItem(account)),
                {
                  code: '',
                  name: 'Total Revenue',
                  balance: revenueTotal,
                  type: 'Revenue',
                  isTotal: true
                }
              ],
              total: revenueTotal
            },
            {
              title: 'Expenses',
              items: [
                ...expenses.map(account => this.accountToReportItem(account)),
                {
                  code: '',
                  name: 'Total Expenses',
                  balance: expenseTotal,
                  type: 'Expense',
                  isTotal: true
                }
              ],
              total: expenseTotal
            }
          ],
          totals: [
            {
              label: 'Net Income',
              value: netIncome
            }
          ]
        };
      })
    );
  }

  getBalanceSheet(): Observable<FinancialReport> {
    return this.accountService.getAccounts().pipe(
      map(accounts => {
        const assets = this.getAccountsByType(accounts, 'Asset');
        const liabilities = this.getAccountsByType(accounts, 'Liability');
        const equity = this.getAccountsByType(accounts, 'Equity');
        
        const assetTotal = this.sumAccountBalances(assets);
        const liabilityTotal = this.sumAccountBalances(liabilities);
        const equityTotal = this.sumAccountBalances(equity);
        const liabEquityTotal = liabilityTotal + equityTotal;
        
        return {
          title: 'Balance Sheet',
          subtitle: 'As of',
          date: new Date().toLocaleDateString(),
          sections: [
            {
              title: 'Assets',
              items: [
                ...assets.map(account => this.accountToReportItem(account)),
                {
                  code: '',
                  name: 'Total Assets',
                  balance: assetTotal,
                  type: 'Asset',
                  isTotal: true
                }
              ],
              total: assetTotal
            },
            {
              title: 'Liabilities',
              items: [
                ...liabilities.map(account => this.accountToReportItem(account)),
                {
                  code: '',
                  name: 'Total Liabilities',
                  balance: liabilityTotal,
                  type: 'Liability',
                  isTotal: true
                }
              ],
              total: liabilityTotal
            },
            {
              title: 'Equity',
              items: [
                ...equity.map(account => this.accountToReportItem(account)),
                {
                  code: '',
                  name: 'Total Equity',
                  balance: equityTotal,
                  type: 'Equity',
                  isTotal: true
                }
              ],
              total: equityTotal
            }
          ],
          totals: [
            {
              label: 'Total Liabilities & Equity',
              value: liabEquityTotal
            }
          ]
        };
      })
    );
  }

  getTrialBalance(): Observable<FinancialReport> {
    return this.accountService.getAccounts().pipe(
      map(accounts => {
        let totalDebits = 0;
        let totalCredits = 0;
        
        const items = accounts.map(account => {
          // Determine if account has debit or credit balance
          const isDebitAccount = account.type === 'Asset' || account.type === 'Expense';
          const amount = account.balance || 0;
          
          let debitAmount = 0;
          let creditAmount = 0;
          
          if (isDebitAccount) {
            debitAmount = amount > 0 ? amount : 0;
            creditAmount = amount < 0 ? -amount : 0;
          } else {
            creditAmount = amount > 0 ? amount : 0;
            debitAmount = amount < 0 ? -amount : 0;
          }
          
          totalDebits += debitAmount;
          totalCredits += creditAmount;
          
          return {
            code: account.code,
            name: account.name,
            type: account.type,
            debitBalance: debitAmount,
            creditBalance: creditAmount
          };
        });
        
        return {
          title: 'Trial Balance',
          subtitle: 'As of',
          date: new Date().toLocaleDateString(),
          sections: [
            {
              title: 'Accounts',
              items: items.map(item => ({
                code: item.code,
                name: item.name,
                balance: item.debitBalance, // We'll use balance for debit
                creditBalance: item.creditBalance, // Add extra property for credit
                type: item.type
              })) as ReportItem[],
              total: 0 // Not used for trial balance
            }
          ],
          totals: [
            {
              label: 'Total Debits',
              value: totalDebits
            },
            {
              label: 'Total Credits',
              value: totalCredits
            }
          ]
        };
      })
    );
  }
  
  private getAccountsByType(accounts: Account[], type: string): Account[] {
    return accounts
      .filter(account => account.type === type && account.isActive)
      .sort((a, b) => a.code.localeCompare(b.code));
  }
  
  private sumAccountBalances(accounts: Account[]): number {
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  }
  
  private accountToReportItem(account: Account): ReportItem {
    return {
      code: account.code,
      name: account.name,
      balance: account.balance || 0,
      type: account.type
    };
  }
}
