import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { LoadingService } from '../loading/loading.service';
import { Schedule } from '../rest/datas/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleDialogService {
  isShowing = false;
  schedule: Schedule;

  constructor(
    private restService: RestService,
    private loadingService: LoadingService) { }

  show() {
    this.loadingService.show();
    this.restService.getSchedule().then(schedule => {
      this.schedule = schedule;
      this.loadingService.hide();
      this.isShowing = true;
    }).catch(error => {
      this.loadingService.hide();
    });
  }

  hide() {
    this.isShowing = false;
  }

  update() {
    if (this.schedule) {
      this.restService.putSchedule(this.schedule).then(response => {
      }).catch(() => {
      });
    }
  }
}
