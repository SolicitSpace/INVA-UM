import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
// import { db, WidgetDataM, WidgetTypeM } from '../../data/db';
import { db, WidgetDataM, WidgetPriorityM } from '../../data/db';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // contains complete data of created widgets
  widgetDataList$: Observable<WidgetDataM[]> = liveQuery(() =>
    db.widgetData.toArray()
  );

  // contains only ongoing widget list
  ongoingWidgetList!: WidgetDataM[];

  constructor(private router: Router) {}

  ngOnInit() {
    this.widgetDataList$.subscribe((res) => {
      this.ongoingWidgetList = _.filter(res, { status: 1 });
    });

    let arr = [
      '03-10-2023',
      '01-10-2023',
      '05-10-2023',
      '02-10-2023',
      '21-10-2023',
      '09-10-2023',
      '22-10-2023',
      '05-11-2023',
      '04-10-2023',
      '23-10-2023',
      '24-10-2023',
    ];

    // Sorting the dates
    const sortArr = arr
      .map((dateStr) => moment(dateStr, 'DD-MM-yyyy').unix())
      .sort((a: number, b: number) => a - b)
      .map((unixVal) => moment.unix(unixVal).format('DD-MM-yyyy'));

    console.log(sortArr);
    arr = sortArr;

    let streakArr = [];
    let streakCounter = 0;
    // figure out how moment can validate dates sequence
    for (let i = 0; i < arr.length - 1; i++) {
      const curr = moment(arr[i], 'DD-MM-yyyy');
      const next = moment(arr[i + 1], 'DD-MM-yyyy');

      if (next.diff(curr, 'day') == 1) {
        console.log('In Sequence');
        streakCounter++;
      } else {
        streakArr.push(streakCounter);
        streakCounter = 0;
        console.log('Sequence Broke');
      }
    }

    console.log('StreaksArr : ', streakArr, "; Latest Streak", streakArr[streakArr.length - 1]);
  }
}
