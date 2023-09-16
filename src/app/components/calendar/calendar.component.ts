import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  // notes
  headerLabels: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  days: any[] = [];
  preLimit: number = 0;
  postLimit: number = 0;

  // for debug purposes
  // currSelTimestamp: any = moment("09/2023", "MM/YYYY")
  currSelTimestamp: any = moment()
  currSelMonth: any = this.currSelTimestamp.format("MM/YYYY")

  ngOnInit(): void {
    console.log("Creating calendar...");
    this.generateCalendar();
  }



  navMonthForward() {
    this.currSelTimestamp = this.currSelTimestamp.add(1, 'month')
    this.generateCalendar()
  }

  navMonthBack() {
    this.currSelTimestamp = this.currSelTimestamp.subtract(1, 'month')
    this.generateCalendar()
  }

  generateCalendar() {

    // resetting the days inside on calendar month view
    this.days = [];

    // updating the current selected month 
    this.currSelMonth = this.currSelTimestamp.format("MMMM YYYY");
    for (let i = 1; i <= this.currSelTimestamp.daysInMonth(); i++) {
      const timeStamp = moment(`${this.getFormattedDigits(i, 2)}-${this.currSelTimestamp.format('MM')}-${this.currSelTimestamp.format('YYYY')}`, "DD-MM-YYYY");

      this.days.push({
        timestamp: timeStamp,
        date: timeStamp.format('DD'),
        name: timeStamp.format('dddd')
      });
    }

    // Setting the preceeding and succeeding empty blocks
    this.preLimit = this.headerLabels.indexOf(this.days[0].name)
    this.postLimit = this.headerLabels.indexOf(this.days[this.days.length - 1].name)
  }

  getFormattedDigits(num: number, totDigits: number) {
    return num.toLocaleString('en-US', {
      minimumIntegerDigits: totDigits,
      useGrouping: false
    })
  }
}
