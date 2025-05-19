import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsListComponent } from './accounts-list/accounts-list.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { JournalEntriesListComponent } from './journal-entries-list/journal-entries-list.component';
import { JournalEntryDetailComponent } from './journal-entry-detail/journal-entry-detail.component';
import { JournalEntryFormComponent } from './journal-entry-form/journal-entry-form.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { FinancialReportComponent } from './financial-report/financial-report.component';
import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'financial-dashboard', component: FinancialDashboardComponent },
  
  // Account routes
  { path: 'accounts', component: AccountsListComponent },
  { path: 'accounts/new', component: AccountFormComponent },
  { path: 'accounts/:id', component: AccountDetailComponent },
  { path: 'accounts/:id/edit', component: AccountFormComponent },
  
  // Journal Entry routes
  { path: 'journal-entries', component: JournalEntriesListComponent },
  { path: 'journal-entries/new', component: JournalEntryFormComponent },
  { path: 'journal-entries/:id', component: JournalEntryDetailComponent },
  { path: 'journal-entries/:id/edit', component: JournalEntryFormComponent },
  
  // Reports routes
  { path: 'reports', component: ReportsListComponent },
  { path: 'reports/:type', component: FinancialReportComponent }
];
