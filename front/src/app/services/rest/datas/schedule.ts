export class TimeForSchedule {
  hour: number;
  minute: number;

  constructor(hour: number, minute: number) {
    this.hour = hour;
    this.minute = minute;
  }
}

export class WeeksForSchedule {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  constructor(
    monday: boolean = false,
    tuesday: boolean = false,
    wednesday: boolean = false,
    thursday: boolean = false,
    friday: boolean = false,
    saturday: boolean = false,
    sunday: boolean = false
  ) {
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
    this.saturday = saturday;
    this.sunday = sunday;
  }
}

export class Schedule {
  _id: string;
  start: TimeForSchedule;
  end: TimeForSchedule;
  weeks: WeeksForSchedule;

  constructor(
    _id: string,
    start = new TimeForSchedule(9, 0),
    end = new TimeForSchedule(18, 0),
    weeks = new WeeksForSchedule()
  ) {
    this._id = _id;
    this.start = start;
    this.end = end;
    this.weeks = weeks;
  }
}
