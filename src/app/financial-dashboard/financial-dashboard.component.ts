import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../services/account.service';
import { JournalEntryService } from '../services/journal-entry.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-financial-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit {
  // Financial metrics
  assetTotal = 0;
  liabilityTotal = 0;
  equityTotal = 0;
  revenueTotal = 0;
  expenseTotal = 0;
  netIncome = 0;
  
  // Account counts
  totalAccounts = 0;
  activeAccounts = 0;
  
  constructor(
    private accountService: AccountService,
    private journalEntryService: JournalEntryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load accounts and calculate metrics
    this.accountService.getAccounts().subscribe(accounts => {
      this.calculateMetrics(accounts);
    });
  }
  
  calculateMetrics(accounts: Account[]): void {
    // Calculate totals by account type
    const assetAccounts = accounts.filter(a => a.type === 'Asset' && a.isActive);
    const liabilityAccounts = accounts.filter(a => a.type === 'Liability' && a.isActive);
    const equityAccounts = accounts.filter(a => a.type === 'Equity' && a.isActive);
    const revenueAccounts = accounts.filter(a => a.type === 'Revenue' && a.isActive);
    const expenseAccounts = accounts.filter(a => a.type === 'Expense' && a.isActive);
    
    this.assetTotal = this.sumAccountBalances(assetAccounts);
    this.liabilityTotal = this.sumAccountBalances(liabilityAccounts);
    this.equityTotal = this.sumAccountBalances(equityAccounts);
    this.revenueTotal = this.sumAccountBalances(revenueAccounts);
    this.expenseTotal = this.sumAccountBalances(expenseAccounts);
    this.netIncome = this.revenueTotal - this.expenseTotal;
    
    // Calculate account counts
    this.totalAccounts = accounts.length;
    this.activeAccounts = accounts.filter(a => a.isActive).length;
  }
  
  sumAccountBalances(accounts: Account[]): number {
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
