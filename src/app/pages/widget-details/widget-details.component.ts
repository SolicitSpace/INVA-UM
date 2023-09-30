import { Component, OnInit } from '@angular/core';
import { SelectedWidgetService } from '../../services/selected-widget.service';
import { Router } from '@angular/router';
// import { WidgetDataM, WidgetStatusM, WidgetTypeM } from 'src/app/data/db';
import { WidgetDataM, WidgetStatusM, db } from 'src/app/data/db';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import * as moment from 'moment';
import { calendarDayT } from 'src/app/data/types';

@Component({
  selector: 'app-widget-details',
  templateUrl: './widget-details.component.html',
  styleUrls: ['./widget-details.component.scss'],
})
export class WidgetDetailsComponent implements OnInit {
  widgetData: WidgetDataM = this.selectedWidgetService.getWidgetData();

  statusVal: string = 'NA';
  typeVal: string = 'NA';
  timeRemaining: string = 'NA';
  createdOn: string = 'NA';
  targetDate: string = 'NA';
  isShowDetailOps: boolean = false;
  constructor(
    private selectedWidgetService: SelectedWidgetService,
    private router: Router
  ) {}

  ngOnInit() {
    // tmp disabled to dev calendar
    // return;
    this.handleInvalidState();
    this.setValueForStatus();
    // this.setValueForType();

    this.setUpCalendarEvt();

    if (this.widgetData.target_date) {
      this.timeRemaining = this.setTimeRemaining();
    }
  }

  toggleDetailOps() {
    this.isShowDetailOps = !this.isShowDetailOps;
  }
  setUpCalendarEvt() {
    // console.log(
    //   '===> ',
    //   moment(this.createdOn, 'DD-MM-yyyy').toDate(),
    //   moment(this.targetDate, 'DD-MM-yyyy').toDate()
    // );

    console.log('=> ', this.widgetData.performed_on);

    // Works for countdown since it has a target date

    // For streaks and last since we hav eto manually punch in dates
  }

  setTimeRemaining() {
    const timeArr = [];
    const val = moment(this.widgetData.target_date, 'YYYY-MM-DD').diff(
      moment()
    );

    const year = moment.duration(val).years();
    timeArr.push(year > 0 ? (year > 1 ? year + ' years' : year + ' year') : '');

    const month = moment.duration(val).months();
    timeArr.push(
      month > 0 ? (month > 1 ? month + ' months' : month + ' month') : ''
    );

    const day = moment.duration(val).days();
    timeArr.push(day > 0 ? (day > 1 ? day + ' days' : day + ' day') : '');

    const hour = moment.duration(val).hours();
    timeArr.push(hour > 0 ? (hour > 1 ? hour + ' hours' : hour + ' hour') : '');

    const minute = moment.duration(val).minutes();
    timeArr.push(
      minute > 0 ? (minute > 1 ? minute + ' minutes' : minute + ' minute') : ''
    );

    return timeArr.join(' ').trim();
  }

  async setValueForStatus() {
    const statusObj: WidgetStatusM[] = await db.widgetStatus
      .where({ id: this.widgetData.status })
      .toArray();

    console.log(statusObj);
    this.statusVal = statusObj[0].value;
  }

  // async setValueForType() {
  //   const typeObj: WidgetTypeM[] = await db.widgetType
  //     .where({ id: this.widgetData.type })
  //     .toArray();

  //   this.typeVal = typeObj[0].value;
  // }

  handleInvalidState() {
    if (!this.selectedWidgetService.getWidgetData())
      this.router.navigate(['home']);
  }

  async setPerformedOnDB(day: calendarDayT) {
    const data = await db.widgetData.get({ id: this.widgetData.id });
    console.log('day : ', day);
    console.log('data : ', data?.id);

    if (!data) return;
    if (!data.id) return;

    // get the curr list
    console.log(this.widgetData, this.widgetData.performed_on);

    if (day.isPerformed) {
      // If the date is already entered then don't add again
      if (this.widgetData.performed_on?.includes(day.date)) {
        console.log('Day already marked.');

        return;
      }

      // add the date in the array
      this.widgetData.performed_on?.push(day.date);
    } else {
      // check if the arr consist the element
      if (!this.widgetData.performed_on?.includes(day.date)) {
        console.log('Day was never marked to unmark it.');
        return;
      }
      // remove the date from array
      const index: number = this.widgetData.performed_on.indexOf(day.date);
      this.widgetData.performed_on?.splice(index, 1);
    }

    // update in the db
    const updData = await db.widgetData.update(data.id, {
      performed_on: this.widgetData.performed_on,
    });
    console.log('updData : ', updData);

    // .add({
    //   // type: parseInt(this.widgetFormGroup.value.widgetType),
    //   priority_id: this.widgetFormGroup.value.priorityId,
    //   detail: this.widgetFormGroup.value.detail,
    //   target_date: this.widgetFormGroup.value.targetDate,
    //   status: 1, // marking status as ongoing
    //   color: this.widgetFormGroup.value.color,
    //   is_highlighted: this.widgetFormGroup.value.isHighlighted,
    //   created_on: moment().format(),
    //   last_edited_on: moment().format(),
    // })
    // .catch((err) => {
    //   throw err;
    // });
  }
}
