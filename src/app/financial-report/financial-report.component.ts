import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ReportsService, FinancialReport } from '../services/reports.service';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent implements OnInit {
  report?: FinancialReport;
  reportType = 'income-statement';
  isTrialBalance = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.reportType = this.route.snapshot.paramMap.get('type') || 'income-statement';
    this.loadReport();
  }

  loadReport(): void {
    this.isTrialBalance = this.reportType === 'trial-balance';
    
    switch (this.reportType) {
      case 'income-statement':
        this.reportsService.getIncomeStatement().subscribe(report => {
          this.report = report;
        });
        break;
      case 'balance-sheet':
        this.reportsService.getBalanceSheet().subscribe(report => {
          this.report = report;
        });
        break;
      case 'trial-balance':
        this.reportsService.getTrialBalance().subscribe(report => {
          this.report = report;
        });
        break;
      default:
        this.router.navigate(['/reports']);
    }
  }

  getAmount(item: any): string {
    return (item.balance || 0).toFixed(2);
  }
  
  getCreditAmount(item: any): string {
    return (item.creditBalance || 0).toFixed(2);
  }

  // Update in financial-report.component.ts
  formatCurrency(amount: number | undefined | null): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }

  // Add these helper methods
  getDebitTotal(): number {
    if (this.report && this.report.totals && this.report.totals.length > 0) {
      return this.report.totals[0].value;
    }
    return 0;
  }

  getCreditTotal(): number {
    if (this.report && this.report.totals && this.report.totals.length > 1) {
      return this.report.totals[1].value;
    }
    return 0;
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }
}
