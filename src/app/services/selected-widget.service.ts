import { Injectable } from '@angular/core';
import { WidgetDataM } from '../data/db';

@Injectable({
  providedIn: 'root',
})
export class SelectedWidgetService {
  private selWidget!: WidgetDataM;

  constructor() {}

  setWidgetData(data: WidgetDataM) {
    this.selWidget = data;
  }
  getWidgetData() {
    return this.selWidget;
  }
}
