import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading-component';
import { DialogComponent } from './components/dialog/dialog-component';
import { ScheduleDialogComponent } from './components/schedule-dialog/schedule-dialog-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoadingComponent, RouterOutlet, DialogComponent, ScheduleDialogComponent],
  template: `
  <app-loading></app-loading>
  <app-dialog></app-dialog>
  <app-schedule-dialog></app-schedule-dialog>
  <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('juketube');
}
