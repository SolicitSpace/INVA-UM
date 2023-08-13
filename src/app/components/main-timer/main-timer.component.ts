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

  ngOnInit() {console.log("Init Main timer")
    this.handleUpdatingValues();
  }

  handleUpdatingValues() {
    this.timerIntrvl = setInterval(() => {
      this.momentRef = moment;
    }, 1000);
  }

  getPercOf(periodType: any) {
    return (
      ((moment().unix() - moment().startOf(periodType).unix()) /
        (moment().endOf(periodType).unix() -
          moment().startOf(periodType).unix())) *
      100
    );
  }

  //
  ngOnChanges() {
    console.log('test');
  }
}
