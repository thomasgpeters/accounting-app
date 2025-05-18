import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule,
    RouterLink
  ],
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {
  account?: Account;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.accountService.getAccount(id).subscribe(account => {
        this.account = account;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }
}
