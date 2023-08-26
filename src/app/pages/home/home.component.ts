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
  }

  
  
}
