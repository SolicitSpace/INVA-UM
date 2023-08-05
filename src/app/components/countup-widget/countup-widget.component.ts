import { Component, Input, OnInit } from '@angular/core';
import { WidgetDataM } from 'src/app/data/db';
import * as moment from 'moment';
@Component({
  selector: 'app-countup-widget',
  templateUrl: './countup-widget.component.html',
  styleUrls: ['./countup-widget.component.scss'],
})
export class CountupWidgetComponent {
  @Input() widgetData!: WidgetDataM;

  detail: string = 'NA';
  timeVal: number = 0;

  ngOnInit(): void {
    this.detail = this.widgetData.detail;
    const val = moment().diff(moment(this.widgetData.created_on));

    this.timeVal = Math.ceil(moment.duration(val).asDays());
  }
}
