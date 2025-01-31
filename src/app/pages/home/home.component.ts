import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
// import { db, WidgetDataM, WidgetTypeM } from '../../data/db';
import { db, WidgetDataM } from '../../data/db';
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
  ongoingWidgetList_div1!: WidgetDataM[];
  ongoingWidgetList_div2!: WidgetDataM[];
  constructor(private router: Router) {}

  ngOnInit() {
    this.widgetDataList$.subscribe((res) => {
      this.ongoingWidgetList = _.filter(res, { status: 1 });

      console.log(this.ongoingWidgetList, this.ongoingWidgetList.length);

      let finish = Math.ceil(this.ongoingWidgetList.length / 2);

      // catch the odds
      // this.ongoingWidgetList_div1 = this.ongoingWidgetList.slice(0, finish)
      this.ongoingWidgetList_div1 = this.ongoingWidgetList.filter(
        (data, index) => {
          return index % 2 == 0 ? true : false;
        }
      );

      // catch the evens
      // this.ongoingWidgetList_div2 = this.ongoingWidgetList.slice(
      //   finish,
      //   this.ongoingWidgetList.length
      // );
      this.ongoingWidgetList_div2 =
        this.ongoingWidgetList.filter((data, index) => {
          return index % 2 != 0 ? true : false;
        });

      console.log('first : ', this.ongoingWidgetList_div1);
      console.log('ongoingWidgetList_div2 : ', this.ongoingWidgetList_div2);

      this.updateStreaks();
    });

    // let arr = [
    //   '03-10-2023',
    //   '01-10-2023',
    //   '05-10-2023',
    //   '02-10-2023',
    //   '21-10-2023',
    //   '09-10-2023',
    //   '22-10-2023',
    //   '05-11-2023',
    //   '04-10-2023',
    //   '23-10-2023',
    //   '24-10-2023',
    // ];

    // // Sorting the dates
    // const sortArr = arr
    //   .map((dateStr) => moment(dateStr, 'DD-MM-yyyy').unix())
    //   .sort((a: number, b: number) => a - b)
    //   .map((unixVal) => moment.unix(unixVal).format('DD-MM-yyyy'));

    // console.log(sortArr);
    // arr = sortArr;

    // let streakArr = [];
    // let streakCounter = 0;
    // // figure out how moment can validate dates sequence
    // for (let i = 0; i < arr.length - 1; i++) {
    //   const curr = moment(arr[i], 'DD-MM-yyyy');
    //   const next = moment(arr[i + 1], 'DD-MM-yyyy');

    //   if (next.diff(curr, 'day') == 1) {
    //     console.log('In Sequence');
    //     streakCounter++;
    //   } else {
    //     streakArr.push(streakCounter);
    //     streakCounter = 0;
    //     console.log('Sequence Broke');
    //   }
    // }

    // console.log(
    //   'StreaksArr : ',
    //   streakArr,
    //   '; Latest Streak',
    //   streakArr[streakArr.length - 1]
    // );

    // update the value
    // update the value here to db
  }

  async updateStreaks() {
    for (let i = 0, lim = this.ongoingWidgetList.length; i < lim; i++) {
      const widgetData = this.ongoingWidgetList[i];
      console.log(widgetData.detail);

      if (!widgetData.id) continue;

      let streakCounter = 0;
      const performedOnArr = widgetData.performed_on;

      const lastPerformedDayMoment = moment(
        performedOnArr[performedOnArr.length - 1],
        'DD-MM-yyyy'
      );

      // is the last day of the streak matches current day or previous day
      // if yes streak ongoing -> backtrack till matching sequence
      if (moment().diff(lastPerformedDayMoment, 'day') <= 1) {
        // backtrack
        for (let i = performedOnArr.length - 1; i >= 0; i--) {
          const curr = moment(performedOnArr[i], 'DD-MM-yyyy');
          const prev = moment(performedOnArr[i - 1], 'DD-MM-yyyy');

          // the streak/sequence was broken
          if (curr.diff(prev, 'day') !== 1) break;

          // if code reaches here that means streak is ongoing so incr the streak counter
          streakCounter++;
        }
      }

      // if no mark as zero streaks
      else streakCounter = 0;

      // update the value here to db
      await db.widgetData.update(widgetData.id, {
        streak: streakCounter,
      });
    }
  }
}
