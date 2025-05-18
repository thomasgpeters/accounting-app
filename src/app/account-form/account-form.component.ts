import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  accountForm!: FormGroup;
  isEditMode = false;
  accountId?: number;

  accountTypes = [
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Expense', label: 'Expense' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.accountId = +idParam;
      this.loadAccount(this.accountId);
    }
  }

  initForm(): void {
    this.accountForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', Validators.required],
      balance: [0, Validators.required],
      isActive: [true]
    });
  }

  loadAccount(id: number): void {
    this.accountService.getAccount(id).subscribe(account => {
      if (account) {
        this.accountForm.patchValue(account);
      }
    });
  }

// ...existing imports

  onSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }

    const accountData = this.accountForm.value;
    
    if (this.isEditMode && this.accountId) {
      this.accountService.updateAccount(this.accountId, accountData).subscribe({
        next: () => {
          console.log('Account updated successfully');
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error updating account', error);
        }
      });
    } else {
      this.accountService.createAccount(accountData).subscribe({
        next: () => {
          console.log('Account created successfully');
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error creating account', error);
        }
      });
    }

    // In a real application, this would call the service to save the account
    console.log('Account form submitted:', this.accountForm.value);
    
    // Navigate back to the accounts list
    this.router.navigate(['/accounts']);
  }

  onCancel(): void {
    this.router.navigate(['/accounts']);
  }

  
}
