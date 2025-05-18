import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntriesListComponent } from './journal-entries-list.component';

describe('JournalEntriesListComponent', () => {
  let component: JournalEntriesListComponent;
  let fixture: ComponentFixture<JournalEntriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntriesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
