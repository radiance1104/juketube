import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'time', standalone: true })
export class TimeFormatPipe implements PipeTransform {
  transform(seconds: number): string {
    const sec = ('00' + seconds % 60).slice(-2);
    const minutes = ('00' + Math.floor((seconds / 60)) % 24).slice(-2);
    const hours = ('00' + Math.floor(Math.floor(seconds / 60) / 24)).slice(-2);
    return `${hours}:${minutes}:${sec}`;
  }
}
