import { Component, Input, OnInit } from '@angular/core';
import { WidgetDataM } from 'src/app/data/db';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SelectedWidgetService } from 'src/app/services/selected-widget.service';
@Component({
  selector: 'app-countup-widget',
  templateUrl: './countup-widget.component.html',
  styleUrls: ['./countup-widget.component.scss'],
})
export class CountupWidgetComponent {
  @Input() widgetData!: WidgetDataM;

  detail: string = 'NA';
  timeVal: number = 0;

  constructor(
    private router: Router,
    private selectedWidgetService: SelectedWidgetService
  ) {}

  ngOnInit(): void {
    this.detail = this.widgetData.detail;
    const val = moment().diff(moment(this.widgetData.created_on));

    this.timeVal = Math.ceil(moment.duration(val).asDays());
  }

  openWidgetDetails() {
    this.selectedWidgetService.setWidgetData(this.widgetData);

    // this.router.navigate(['widget-details', { data: JSON.stringify(this.widgetData) }]);
    // this.router.navigate(['widget-details'], { queryParams: this.widgetData, skipLocationChange: true });
    this.router.navigate(['widget-details'], { state: this.widgetData });
  }
}
