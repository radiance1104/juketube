import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
  }

  onClickOk() {
    this.dialogService.okClosure();
    this.dialogService.isShowing = false;
  }

  onClickCancel() {
    if (this.dialogService.cancelClosure) {
      this.dialogService.cancelClosure();
    }
    this.dialogService.isShowing = false;
  }
}
