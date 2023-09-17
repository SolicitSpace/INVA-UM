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
    this.formatStartAndEndDates();
    this.setUpCalendarEvt();

    if (this.widgetData.target_date) {
      this.timeRemaining = this.setTimeRemaining();
    }
  }

  formatStartAndEndDates() {
    this.createdOn = moment(this.widgetData.created_on).format('DD-MM-yyyy');

    this.targetDate = this.widgetData.target_date
      ? moment(this.widgetData.target_date).format('DD-MM-yyyy')
      : moment().format('DD-MM-yyyy');
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
    const data = await db.widgetData.get({id: this.widgetData.id})
    console.log("day : ", day);
    console.log("data : ", data?.id);

    if (!data) return;
    if (!data.id) return;

    const updData = await db.widgetData.update(data.id, {detail: "temple"})
    console.log("updData : ", updData);
    


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
