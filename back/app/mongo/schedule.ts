import { ObjectId } from 'mongodb';

export class TimeForSchedule {
  hour: number;
  minute: number;

  constructor(hour: number, minute: number) {
    this.hour = hour;
    this.minute = minute;
  }
}

export class WeeksForSchedule {
  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  sunday = false;
}

export class Schedule {
  _id: ObjectId;
  start = new TimeForSchedule(9, 0);
  end = new TimeForSchedule(18, 0);
  weeks = new WeeksForSchedule();
}
