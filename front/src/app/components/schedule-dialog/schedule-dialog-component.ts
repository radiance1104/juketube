import { Component, inject, signal } from '@angular/core';
import { ScheduleDialogService } from '../../services/schedule-dialog/schedule-dialog-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-dialog-component.html',
  styleUrl: './schedule-dialog-component.scss',
})
export class ScheduleDialogComponent {
  protected readonly scheduleDialogService = inject(ScheduleDialogService)!;

  readonly hours = ScheduleDialogComponent.array(0, 23);
  readonly minutes = ScheduleDialogComponent.array(0, 55, 5);

  onClickCancel() {
    this.scheduleDialogService.isShowing.set(false);
  }

  onClickOk() {
    this.scheduleDialogService.update();
    this.scheduleDialogService.isShowing.set(false);
  }

  private static array(from: number, to: number, step = 1): number[] {
    const result: number[] = [];
    for (let i = from; i <= to; i+= step) {
      result.push(i);
    }
    return result;
  }
}
