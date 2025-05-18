import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { JournalEntryService } from '../services/journal-entry.service';
import { AccountService } from '../services/account.service';
import { JournalEntry } from '../models/journal-entry.model';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-journal-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './journal-entry-form.component.html',
  styleUrls: ['./journal-entry-form.component.scss']
})
export class JournalEntryFormComponent implements OnInit {
  journalEntryForm!: FormGroup;
  isEditMode = false;
  journalEntryId?: number;
  accounts: Account[] = [];
  
  // Calculated totals
  totals = {
    debits: 0,
    credits: 0,
    isBalanced: false
  };

  get linesFormArray(): FormArray {
    return this.journalEntryForm.get('lines') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private journalEntryService: JournalEntryService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    // Load accounts
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
    
    this.initForm();
    
    // Check if we're editing an existing entry
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.journalEntryId = +idParam;
      this.loadJournalEntry(this.journalEntryId);
    } else {
      // Add an initial empty line for new entries
      this.addLine();
    }
    
    // Calculate totals whenever the form changes
    this.journalEntryForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  initForm(): void {
    this.journalEntryForm = this.fb.group({
      entryDate: [new Date(), Validators.required],
      referenceNumber: [''],
      description: ['', Validators.required],
      lines: this.fb.array([])
    });
  }

  loadJournalEntry(id: number): void {
    this.journalEntryService.getJournalEntry(id).subscribe(entry => {
      if (entry) {
        // Clear existing lines
        while (this.linesFormArray.length) {
          this.linesFormArray.removeAt(0);
        }
        
        // Patch the main form fields
        this.journalEntryForm.patchValue({
          entryDate: new Date(entry.entryDate),
          referenceNumber: entry.referenceNumber,
          description: entry.description
        });
        
        // Add lines
        entry.lines.forEach(line => {
          this.addLine(line);
        });
        
        this.calculateTotals();
      }
    });
  }

  addLine(line?: any): void {
    const lineForm = this.fb.group({
      accountId: [line?.accountId || null, Validators.required],
      description: [line?.description || ''],
      debitAmount: [line?.debitAmount || 0],
      creditAmount: [line?.creditAmount || 0]
    });
    
    this.linesFormArray.push(lineForm);
  }

  removeLine(index: number): void {
    this.linesFormArray.removeAt(index);
  }

  onAccountChange(index: number): void {
    const accountId = this.linesFormArray.at(index).get('accountId')?.value;
    const account = this.accounts.find(a => a.id === accountId);
    
    // You could optionally update the line description based on the account
    if (account) {
      // this.linesFormArray.at(index).get('description')?.setValue(account.name);
    }
  }

  onDebitChange(index: number): void {
    const debitAmount = +this.linesFormArray.at(index).get('debitAmount')?.value || 0;
    
    // If debit is entered, clear credit
    if (debitAmount > 0) {
      this.linesFormArray.at(index).get('creditAmount')?.setValue(0);
    }
    
    this.calculateTotals();
  }

  onCreditChange(index: number): void {
    const creditAmount = +this.linesFormArray.at(index).get('creditAmount')?.value || 0;
    
    // If credit is entered, clear debit
    if (creditAmount > 0) {
      this.linesFormArray.at(index).get('debitAmount')?.setValue(0);
    }
    
    this.calculateTotals();
  }

  calculateTotals(): void {
    let totalDebits = 0;
    let totalCredits = 0;
    
    const lines = this.linesFormArray.value;
    lines.forEach((line: any) => {
      totalDebits += +line.debitAmount || 0;
      totalCredits += +line.creditAmount || 0;
    });
    
    this.totals = {
      debits: totalDebits,
      credits: totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01 // Allow for small rounding errors
    };
  }

  toggleDebitCredit(index: number): void {
    const line = this.linesFormArray.at(index);
    const debitAmount = +line.get('debitAmount')?.value || 0;
    const creditAmount = +line.get('creditAmount')?.value || 0;
    
    if (debitAmount > 0) {
      line.patchValue({
        debitAmount: 0,
        creditAmount: debitAmount
      });
    } else if (creditAmount > 0) {
      line.patchValue({
        debitAmount: creditAmount,
        creditAmount: 0
      });
    }
    
    this.calculateTotals();
  }

  onSubmit(): void {
    if (this.journalEntryForm.invalid || !this.totals.isBalanced) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.journalEntryForm);
      return;
    }
    
    const formValue = this.journalEntryForm.value;
    
    // Format the date as a string (yyyy-MM-dd)
    const entryDate = new Date(formValue.entryDate);
    const formattedDate = entryDate.toISOString().split('T')[0];
    
    const journalEntryData = {
      ...formValue,
      entryDate: formattedDate,
      isPosted: false
    };
    
    if (this.isEditMode && this.journalEntryId) {
      this.journalEntryService.updateJournalEntry(this.journalEntryId, journalEntryData).subscribe({
        next: () => {
          this.router.navigate(['/journal-entries', this.journalEntryId]);
        },
        error: (error) => {
          console.error('Error updating journal entry', error);
        }
      });
    } else {
      this.journalEntryService.createJournalEntry(journalEntryData).subscribe({
        next: (newEntry) => {
          this.router.navigate(['/journal-entries', newEntry.id]);
        },
        error: (error) => {
          console.error('Error creating journal entry', error);
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.journalEntryId) {
      this.router.navigate(['/journal-entries', this.journalEntryId]);
    } else {
      this.router.navigate(['/journal-entries']);
    }
  }
  
  // Helper to mark all controls as touched for validation
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
