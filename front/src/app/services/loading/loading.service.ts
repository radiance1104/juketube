import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isShowing = false;

  constructor() { }

  show() {
    this.isShowing = true;
  }

  hide() {
    this.isShowing = false;
  }
}
