import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDialogComponent } from './schedule-dialog-component';

describe('ScheduleDialogComponent', () => {
  let component: ScheduleDialogComponent;
  let fixture: ComponentFixture<ScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
