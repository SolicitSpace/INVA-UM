import { Injectable } from '@angular/core';
import { WidgetDataM } from '../data/db';

@Injectable({
  providedIn: 'root',
})
export class SelectedWidgetService {

  // Setting a default value to prevent null error
  private selWidget: WidgetDataM = {
    id: 0,
    detail: "NA",
    target_date: "NA",
    status: 0,
    performed_on: [],
    priority_id: 0,
    is_highlighted: false,
    color: "#000000",
    created_on: "NA",
    streak: 0,
    last_edited_on: "NA",
  };;

  constructor() { }

  setWidgetData(data: WidgetDataM) {
    this.selWidget = data;
  }
  getWidgetData() {
    return this.selWidget;
  }
}
