import { Injectable, signal } from '@angular/core';
import { RestService } from '../rest/rest-service';
import { LoadingService } from '../loading/loading-service';
import { Schedule } from '../rest/datas/schedule';

@Injectable({
  providedIn: 'root',
})
export class ScheduleDialogService {
  isShowing = signal(false);
  schedule = signal<Schedule>({
    _id: '',
    start: { hour: 0, minute: 0 },
    end: { hour: 0, minute: 0 },
    weeks: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });

  constructor(
    private restService: RestService,
    private loadingService: LoadingService) { }

  async show() {
    this.loadingService.show();
    try {
      const schedule = await this.restService.getSchedule()
      this.schedule.set(schedule);
      this.loadingService.hide();
      this.isShowing.set(true);
    } catch (error) {
      this.loadingService.hide();
    }
  }

  hide() {
    this.isShowing.set(false);
  }

  async update() {
    const schedule = this.schedule();
    if (schedule) {
      try {
        await this.restService.putSchedule(schedule);
      } catch (error) {
        console.error('Failed to update schedule', error);
      }
    }
  }
}
