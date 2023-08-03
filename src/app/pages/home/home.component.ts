import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
import { db, WidgetDataM, WidgetTypeM } from '../../data/db';
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

  // contains only the types of widgets
  widgetTypeList$: Observable<WidgetTypeM[]> = liveQuery(() =>
    db.widgetType.toArray()
  );

  constructor(private router: Router) {}

  ngOnInit() {
    this.ongoingWidgetList = [
      {
          "type": 2,
          "detail": "Teast",
          "target_date": "",
          "status": 1,
          "created_on": "2023-08-03T08:42:50+05:30",
          "last_edited_on": "2023-08-03T08:42:50+05:30",
          "id": 1
      },
      {
          "type": 3,
          "detail": "Checjkk",
          "target_date": "",
          "status": 1,
          "created_on": "2023-08-03T08:42:58+05:30",
          "last_edited_on": "2023-08-03T08:42:58+05:30",
          "id": 2
      }
  ]

    this.widgetDataList$.subscribe((res) => {
      this.ongoingWidgetList = _.filter(res, { status: 1 });
      console.log(this.ongoingWidgetList)
    });
  }

  openWidgetCreator() {
    this.router.navigate(['create-new']);
  }
}
