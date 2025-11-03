import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public readonly isShowing = signal(false);

  constructor() {}

  show() {
    this.isShowing.set(true);
  }

  hide() {
    this.isShowing.set(false);
  }
}
