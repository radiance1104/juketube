import { Component, inject } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-component.html',
  styleUrl: './dialog-component.scss',
})
export class DialogComponent {
  protected readonly dialogService = inject(DialogService)!;

  onClickOk() {
    this.dialogService.okClosure?.();
    this.dialogService.isShowing.set(false);
  }

  onClickCancel() {
    this.dialogService.cancelClosure?.();
    this.dialogService.isShowing.set(false);
  }
}
