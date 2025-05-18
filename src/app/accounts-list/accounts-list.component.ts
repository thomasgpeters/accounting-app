import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {
  accounts: Account[] = [];
  displayedColumns: string[] = ['code', 'name', 'type', 'balance', 'actions'];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }
}
