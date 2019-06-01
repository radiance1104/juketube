import { Component, OnInit } from '@angular/core';
import { ScheduleDialogService } from 'src/app/services/schedule-dialog/schedule-dialog.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { Schedule } from 'src/app/services/rest/datas/schedule';
import { range } from 'rxjs';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit {
  hours = ScheduleDialogComponent.array(0, 23);
  minutes = ScheduleDialogComponent.array(0, 55, 5);

  constructor(private scheduleDialogService: ScheduleDialogService) { }

  ngOnInit() {
  }

  onClickCancel() {
    this.scheduleDialogService.isShowing = false;
  }

  onClickOk() {
    this.scheduleDialogService.update();
    this.scheduleDialogService.isShowing = false;
  }

  private static array(from: number, to: number, step = 1) {
    const result = [];
    for (let i = from; i <= to; i+= step) {
      result.push(i);
    }
    return result;
  }
}
