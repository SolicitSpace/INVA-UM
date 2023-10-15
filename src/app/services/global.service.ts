import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { WidgetDataM } from '../data/db';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private router: Router) {}

  onLogout() {
    localStorage.clear();
    this.router.navigate(['entry']);
  }

  /**
   * Setting the Performed On For passed date. Also sorting the arr.
   * @param widgetData
   * @param date
   * @returns updated & sorted widgetData
   */
  setPerformedOnDate(widgetData: WidgetDataM, date: string): WidgetDataM {
    // adding the date in arr
    widgetData.performed_on.push(date);

    // sort the dates
    widgetData.performed_on = this.sortDates(widgetData.performed_on);

    return widgetData;
  }
  /**
   * Sort Array of dates in Ascending order
   * @param datesArr
   * @returns sorted array of dates
   */
  sortDates(datesArr: string[]): string[] {
    return datesArr
      .map((dateStr) => moment(dateStr, 'DD-MM-yyyy').unix())
      .sort((a: number, b: number) => a - b)
      .map((unixVal) => moment.unix(unixVal).format('DD-MM-yyyy'));
  }

  /**
   * Unsetting/removing the performed_on date from widgetDataArr
   * @param widgetData
   * @param date
   * @returns result object with a date removed from arr
   */
  removePerformedOnDate(widgetData: WidgetDataM, date: string): WidgetDataM {
    const index: number = widgetData.performed_on.indexOf(date);
    widgetData.performed_on?.splice(index, 1);

    return widgetData;
  }
}
