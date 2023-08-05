import { Component, Input, OnInit } from '@angular/core';
import { WidgetDataM } from 'src/app/data/db';
import * as moment from 'moment';

@Component({
  selector: 'app-countdown-widget',
  templateUrl: './countdown-widget.component.html',
  styleUrls: ['./countdown-widget.component.scss'],
})
export class CountdownWidgetComponent implements OnInit {
  @Input() widgetData!: WidgetDataM;

  detail: string = 'NA';
  timeVal: number = 0;

  ngOnInit(): void {
    this.detail = this.widgetData.detail;
    const val = moment(this.widgetData.target_date, 'YYYY-MM-DD').diff(
      moment()
    );

    this.timeVal = Math.ceil(moment.duration(val).asDays());
  }
}
