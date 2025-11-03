import { TestBed } from '@angular/core/testing';

import { ScheduleDialogService } from './schedule-dialog-service';

describe('ScheduleDialogService', () => {
  let service: ScheduleDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
