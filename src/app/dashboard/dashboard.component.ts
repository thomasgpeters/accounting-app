import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AccountService } from '../services/account.service';
import { JournalEntryService } from '../services/journal-entry.service';
import { Account } from '../models/account.model';
import { JournalEntry } from '../models/journal-entry.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  recentEntries: JournalEntry[] = [];
  
  // Financial metrics
  cashBalance = 0;
  receivablesBalance = 0;
  payablesBalance = 0;
  netIncome = 0;
  
  // Stats
  totalAccounts = 0;
  unpostedEntries = 0;

  constructor(
    private accountService: AccountService,
    private journalEntryService: JournalEntryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load accounts
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
      this.totalAccounts = accounts.filter(a => a.isActive).length;
      
      // Calculate financial metrics
      this.cashBalance = this.getAccountsBalance(accounts, 'Asset', (a) => 
        a.name.toLowerCase().includes('cash'));
      
      this.receivablesBalance = this.getAccountsBalance(accounts, 'Asset', (a) => 
        a.name.toLowerCase().includes('receivable'));
      
      this.payablesBalance = this.getAccountsBalance(accounts, 'Liability', (a) => 
        a.name.toLowerCase().includes('payable'));
      
      // Calculate net income (Revenue - Expenses)
      const revenue = this.getAccountsBalance(accounts, 'Revenue');
      const expenses = this.getAccountsBalance(accounts, 'Expense');
      this.netIncome = revenue - expenses;
    });
    
    // Load recent journal entries
    this.journalEntryService.getJournalEntries().subscribe(entries => {
      // Sort by date descending and take first 5
      this.recentEntries = entries
        .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
        .slice(0, 5);
      
      // Count unposted entries
      this.unpostedEntries = entries.filter(e => !e.isPosted).length;
    });
  }
  
  getAccountsBalance(accounts: Account[], type: string, filter?: (account: Account) => boolean): number {
    return accounts
      .filter(account => account.type === type && account.isActive && (!filter || filter(account)))
      .reduce((sum, account) => sum + (account.balance || 0), 0);
  }
}
