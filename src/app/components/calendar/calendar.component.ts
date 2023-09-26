import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import * as moment from 'moment';
import { calendarDayT } from '../../data/types';
import { WidgetDataM } from 'src/app/data/db';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  createdOn: string = 'NA';
  currDate: string = 'NA';
  targetDate: string = 'NA';

  // Need to work on this
  // Will loop in through it
  @Input() widgetsData: WidgetDataM[] = [];

  @Output() updatePerformedOnEvt = new EventEmitter<calendarDayT>();

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
    console.log('widgetData : ', this.widgetsData);

    this.formatStartAndEndDates();

    this.currDate = this.currSelTimestamp.format('DD-MM-YYYY');

    this.generateCalendar();
  }

  formatStartAndEndDates() {
    this.createdOn = moment(this.widgetsData[0].created_on).format(
      'DD-MM-yyyy'
    );

    this.targetDate = this.widgetsData[0].target_date
      ? moment(this.widgetsData[0].target_date).format('DD-MM-yyyy')
      : moment().format('DD-MM-yyyy');
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
        isPerfCtrlOn: false,
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
      day.timestamp.valueOf() >=
        moment(this.createdOn, 'DD-MM-YYYY').valueOf() &&
      day.timestamp.valueOf() <= moment(this.targetDate, 'DD-MM-YYYY').valueOf()
    );
  }
  openPerformedCtrls(index: number) {
    this.days = this.days.map((o) => ({
      ...o,
      isPerfCtrlOn: false,
    }));
    this.days[index].isPerfCtrlOn = true;
  }
  setPerformedStatus(isPerformed: boolean, day: calendarDayT) {
    day.isPerformed = isPerformed;
    // need the parent array
    this.updatePerformedOnEvt.emit(day);
  }
}
