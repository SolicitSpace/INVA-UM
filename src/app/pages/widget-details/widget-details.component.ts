import { Component, OnInit } from '@angular/core';
import { SelectedWidgetService } from '../../services/selected-widget.service';
import { Router } from '@angular/router';
// import { WidgetDataM, WidgetStatusM, WidgetTypeM } from 'src/app/data/db';
import {
  WidgetDataM,
  WidgetPriorityM,
  WidgetStatusM,
  db,
} from 'src/app/data/db';
import * as moment from 'moment';
import { calendarDayT } from 'src/app/data/types';
import { Observable, liveQuery } from 'dexie';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-widget-details',
  templateUrl: './widget-details.component.html',
  styleUrls: ['./widget-details.component.scss'],
})
export class WidgetDetailsComponent implements OnInit {
  widgetData: WidgetDataM = this.selectedWidgetService.getWidgetData();

  widgetPriorityList$: Observable<WidgetPriorityM[]> = liveQuery(() =>
    db.widgetPriority.toArray()
  );
  widgetStatusList$: Observable<WidgetStatusM[]> = liveQuery(() =>
    db.widgetStatus.toArray()
  );

  statusVal: string = 'NA';
  priorityVal: string = 'NA';
  timeRemaining: string = 'NA';
  createdOn: string = 'NA';
  isShowDetailOps: boolean = false;

  constructor(
    private selectedWidgetService: SelectedWidgetService,
    private router: Router,
    private global: GlobalService
  ) {}

  ngOnInit() {
    // tmp disabled to dev calendar
    // return;
    this.handleInvalidState();
    this.setValueForStatus();
    this.setValueForPriority();
    // this.setValueForType();
    this.createdOn = moment(this.widgetData.created_on).format('DD-MM-yyyy');

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
    const obj: WidgetStatusM[] = await db.widgetStatus
      .where({ id: this.widgetData.status })
      .toArray();

    console.log(obj);
    this.statusVal = obj[0].value;
  }
  async setValueForPriority() {
    const obj: WidgetPriorityM[] = await db.widgetPriority
      .where({ id: this.widgetData.priority_id })
      .toArray();

    console.log(obj);
    this.priorityVal = obj[0].value;
  }

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

      // Set Performed_on & update the widgetData
      this.widgetData = this.global.setPerformedOnDate(
        this.widgetData,
        day.date
      );
    } else {
      // check if the arr consist the element
      if (!this.widgetData.performed_on?.includes(day.date)) {
        console.log('Day was never marked to unmark it.');
        return;
      }
      // remove the date from array
      this.widgetData = this.global.removePerformedOnDate(
        this.widgetData,
        day.date
      );
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

  openWidgetEditor() {
    this.router.navigate(['edit-widget']);
  }

  showDeleteWidgetPrompt() {
    // will show the prompt later
    if (
      confirm(
        `Are you sure you want to delete "${this.widgetData.detail}" widget?`
      )
    )
      this.deleteWidgetPrompt();
  }
  deleteWidgetPrompt() {
    console.log(this.widgetData);
    if (this.widgetData.id) {
      db.widgetData
        .delete(this.widgetData.id)
        .then((data) => {
          alert('Widget Deleted Successfully! ');
          this.router.navigate(['home']);
        })
        .catch((err) => alert(err));
    } else alert('Invalid Widget');
  }
}
