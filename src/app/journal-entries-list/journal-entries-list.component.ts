import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JournalEntryService } from '../services/journal-entry.service';
import { JournalEntry } from '../models/journal-entry.model';

@Component({
  selector: 'app-journal-entries-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './journal-entries-list.component.html',
  styleUrls: ['./journal-entries-list.component.scss']
})
export class JournalEntriesListComponent implements OnInit {
  journalEntries: JournalEntry[] = [];

  constructor(private journalEntryService: JournalEntryService) { }

  ngOnInit(): void {
    this.loadJournalEntries();
  }

  loadJournalEntries(): void {
    this.journalEntryService.getJournalEntries().subscribe(entries => {
      this.journalEntries = entries;
    });
  }

  postEntry(id: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    this.journalEntryService.postJournalEntry(id).subscribe(() => {
      this.loadJournalEntries();
    });
  }
}
