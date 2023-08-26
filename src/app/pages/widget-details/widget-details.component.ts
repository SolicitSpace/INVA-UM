import { Component, OnInit } from '@angular/core';
import { SelectedWidgetService } from '../../services/selected-widget.service';
import { Router } from '@angular/router';
// import { WidgetDataM, WidgetStatusM, WidgetTypeM } from 'src/app/data/db';
import { WidgetDataM, WidgetStatusM, WidgetPriorityM } from 'src/app/data/db';
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
import { db } from '../../data/db';
import { CalendarEvent } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

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
  calendarEvt!: CalendarEvent[];
  createdOn: string = 'NA';
  targetDate: string = 'NA';

  constructor(
    private selectedWidgetService: SelectedWidgetService,
    private router: Router
  ) {}

  ngOnInit() {
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
    const colors: Record<string, EventColor> = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
    };

    // console.log(
    //   '===> ',
    //   moment(this.createdOn, 'DD-MM-yyyy').toDate(),
    //   moment(this.targetDate, 'DD-MM-yyyy').toDate()
    // );

    console.log("=> ", this.widgetData.performed_on)
    

    // Works for countdown since it has a target date

    // For streaks and last since we hav eto manually punch in dates


    this.calendarEvt = [
      {
        start: moment(this.createdOn, 'DD-MM-yyyy').toDate(),
        end: moment(this.targetDate, 'DD-MM-yyyy').toDate(),
        title: this.widgetData.detail,
        color: { ...colors['red'] },
        allDay: true,
      },
    ];
    
    this.calendarEvt = [
      {
        start: moment(this.createdOn, 'DD-MM-yyyy').toDate(),
        end: moment(this.targetDate, 'DD-MM-yyyy').toDate(),
        title: this.widgetData.detail,
        color: { ...colors['red'] },
        allDay: true,
      },
    ];
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
}
