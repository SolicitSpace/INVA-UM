import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-main-timer',
  templateUrl: './main-timer.component.html',
  styleUrls: ['./main-timer.component.scss'],
})
export class MainTimerComponent implements OnInit, OnChanges {
  timeStr: string = moment().format('h:mm:ss a');
  timerIntrvl: any;
  public momentRef = moment;

  constructor() {}

  ngOnInit() {
    console.log(moment());
    console.log(moment().format('dddd, Do MMMM, YYYY'));
    console.log(moment().format('h:mm:ss a'));
    console.log(moment().endOf('year').toISOString());
    console.log(
      moment().startOf('year').unix(),
      moment().unix(),
      moment().endOf('year').unix()
    );
    console.log(
      ((moment().unix() - moment().startOf('month').unix()) /
        (moment().endOf('month').unix() - moment().startOf('month').unix())) *
        100
    );

    this.handleUpdatingValues();
  }

  handleUpdatingValues() {
    this.timerIntrvl = setInterval(() => {
      this.momentRef = moment;
    }, 1000);
  }

  getPercOf(periodType: any) {
    return ((moment().unix() - moment().startOf(periodType).unix()) /
      (moment().endOf(periodType).unix() -
        moment().startOf(periodType).unix())) *
      100;
  }

  //
  ngOnChanges() {
    console.log('test');
  }
}
