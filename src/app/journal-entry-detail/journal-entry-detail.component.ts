import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { JournalEntryService } from '../services/journal-entry.service';
import { JournalEntry } from '../models/journal-entry.model';

@Component({
  selector: 'app-journal-entry-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './journal-entry-detail.component.html',
  styleUrls: ['./journal-entry-detail.component.scss']
})
export class JournalEntryDetailComponent implements OnInit {
  journalEntry?: JournalEntry;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private journalEntryService: JournalEntryService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.journalEntryService.getJournalEntry(id).subscribe(entry => {
        this.journalEntry = entry;
      });
    }
  }

  getTotalDebits(): number {
    return this.journalEntry?.lines.reduce((sum, line) => sum + line.debitAmount, 0) || 0;
  }

  getTotalCredits(): number {
    return this.journalEntry?.lines.reduce((sum, line) => sum + line.creditAmount, 0) || 0;
  }

  isBalanced(): boolean {
    const debits = this.getTotalDebits();
    const credits = this.getTotalCredits();
    return Math.abs(debits - credits) < 0.01;
  }

  postEntry(): void {
    if (this.journalEntry && !this.journalEntry.isPosted) {
      this.journalEntryService.postJournalEntry(this.journalEntry.id).subscribe(entry => {
        if (entry) {
          this.journalEntry = entry;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/journal-entries']);
  }
}
