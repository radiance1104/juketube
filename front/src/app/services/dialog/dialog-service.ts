import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  title = signal('');
  message = signal('');
  okClosure: (() => void) | null = null;
  cancelClosure: (() => void) | null = null;
  isShowing = signal(false);

  constructor() { }

  show(title: string, message: string, okClosure: any, cancelClosure?: any) {
    this.title.set(title);
    this.message.set(message);
    this.okClosure = okClosure;
    this.cancelClosure = cancelClosure || null;
    this.isShowing.set(true);
  }
}
