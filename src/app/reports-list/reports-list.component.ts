import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent {
  reports = [
    {
      title: 'Income Statement',
      description: 'View revenue, expenses, and net income for a period',
      icon: 'trending_up',
      route: '/reports/income-statement'
    },
    {
      title: 'Balance Sheet',
      description: 'View assets, liabilities, and equity as of a specific date',
      icon: 'account_balance',
      route: '/reports/balance-sheet'
    },
    {
      title: 'Trial Balance',
      description: 'View all accounts with their debit and credit balances',
      icon: 'view_list',
      route: '/reports/trial-balance'
    }
  ];
}
