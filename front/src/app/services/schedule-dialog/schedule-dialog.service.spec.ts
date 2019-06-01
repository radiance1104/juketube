import { TestBed } from '@angular/core/testing';

import { ScheduleDialogService } from './schedule-dialog.service';

describe('ScheduleDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleDialogService = TestBed.get(ScheduleDialogService);
    expect(service).toBeTruthy();
  });
});
