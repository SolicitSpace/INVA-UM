import { Component, OnInit } from '@angular/core';
import { SelectedWidgetService } from '../../services/selected-widget.service';
import { Router } from '@angular/router';
import { WidgetDataM, WidgetStatusM, WidgetTypeM } from 'src/app/data/db';

import * as moment from 'moment';
import { db } from '../../data/db';

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

  constructor(
    private selectedWidgetService: SelectedWidgetService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('++> ', this.widgetData);
    this.handleInvalidState();

    this.setValueForStatus();
    this.setValueForType();

    if (this.widgetData.type == 1) {
      this.timeRemaining = this.setTimeRemaining()
      console.log(this.setTimeRemaining());
      // this.timeRemaining = Math.ceil(moment.duration(val).asDays());
    }
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

  async setValueForType() {
    const typeObj: WidgetTypeM[] = await db.widgetType
      .where({ id: this.widgetData.type })
      .toArray();

    this.typeVal = typeObj[0].value;
  }

  handleInvalidState() {
    if (!this.selectedWidgetService.getWidgetData())
      this.router.navigate(['home']);
  }
}
