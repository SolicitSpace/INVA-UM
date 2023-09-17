import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as moment from 'moment';
import { calendarDayT } from '../../data/types';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @Input() createdOn: string = 'NA';
  currDate: string = 'NA';
  @Input() targetDate: string = 'NA';

  // notes
  headerLabels: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  days: calendarDayT[] = [];
  preLimit: number = 0;
  postLimit: number = 0;

  // for debug purposes
  // currSelTimestamp: any = moment("09/2023", "MM/YYYY")
  currSelTimestamp: any = moment();
  currSelMonth: any = this.currSelTimestamp.format('MM/YYYY');

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('Creating calendar...');
    console.log(this.createdOn, this.targetDate);

    this.currDate = this.currSelTimestamp.format('DD-MM-YYYY');
    console.log(this.currDate);

    this.generateCalendar();
  }

  navMonthForward() {
    this.currSelTimestamp = this.currSelTimestamp.add(1, 'month');
    this.generateCalendar();
  }

  navMonthBack() {
    this.currSelTimestamp = this.currSelTimestamp.subtract(1, 'month');
    this.generateCalendar();
  }

  generateCalendar() {
    // resetting the days inside on calendar month view
    this.days = [];

    // updating the current selected month
    this.currSelMonth = this.currSelTimestamp.format('MMMM YYYY');
    for (let i = 1; i <= this.currSelTimestamp.daysInMonth(); i++) {
      const timeStamp = moment(
        `${this.getFormattedDigits(i, 2)}-${this.currSelTimestamp.format(
          'MM'
        )}-${this.currSelTimestamp.format('YYYY')}`,
        'DD-MM-YYYY'
      );

      this.days.push({
        timestamp: timeStamp,
        dayOfMonth: timeStamp.format('DD'),
        date: timeStamp.format('DD-MM-YYYY'),
        name: timeStamp.format('dddd'),
      });
    }

    // Setting the preceeding and succeeding empty blocks
    this.preLimit = this.headerLabels.indexOf(this.days[0].name);
    this.postLimit = this.headerLabels.indexOf(
      this.days[this.days.length - 1].name
    );
  }

  getFormattedDigits(num: number, totDigits: number) {
    return num.toLocaleString('en-US', {
      minimumIntegerDigits: totDigits,
      useGrouping: false,
    });
  }

  isBetweenDay(day: calendarDayT) {
    return (
      day.timestamp.valueOf() >
        moment(this.createdOn, 'DD-MM-YYYY').valueOf() &&
      day.timestamp.valueOf() < moment(this.targetDate, 'DD-MM-YYYY').valueOf()
    );
  }
}
