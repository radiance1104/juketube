import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  title: string;
  message: string;
  okClosure: any;
  cancelClosure: any;
  isShowing = false;

  constructor() { }

  show(title: string, message: string, okClosure: any, cancelClosure?: any) {
    this.title = title;
    this.message = message;
    this.okClosure = okClosure;
    this.cancelClosure = cancelClosure;
    this.isShowing = true;
  }
}
