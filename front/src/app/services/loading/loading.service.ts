import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  shown = false;

  constructor() { }

  show() {
    this.shown = true;
  }

  hide() {
    this.shown = false;
  }
}
