import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportComponent } from './financial-report.component';

describe('FinancialReportComponent', () => {
  let component: FinancialReportComponent;
  let fixture: ComponentFixture<FinancialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
