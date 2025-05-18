import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryDetailComponent } from './journal-entry-detail.component';

describe('JournalEntryDetailComponent', () => {
  let component: JournalEntryDetailComponent;
  let fixture: ComponentFixture<JournalEntryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
