import { Component, Input, OnInit } from '@angular/core';
import { WidgetDataM } from 'src/app/data/db';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SelectedWidgetService } from 'src/app/services/selected-widget.service';
@Component({
  selector: 'app-last-performed-on-widget',
  templateUrl: './last-performed-on-widget.component.html',
  styleUrls: ['./last-performed-on-widget.component.scss'],
})
export class LastPerformedOnWidgetComponent {
  @Input() widgetData!: WidgetDataM;

  detail: string = 'NA';
  lastPerformedOn!: number;

  constructor(
    private router: Router,
    private selectedWidgetService: SelectedWidgetService
  ) {}

  ngOnInit(): void {
    console.log('widgetData', this.widgetData);
    // basically diff
    // const val =
    //   moment(this.widgetData.target_date, 'YYYY-MM-DD').unix() -
    //   moment().unix();

    this.detail = this.widgetData.detail;

    if (!this.widgetData.performed_on) return;

    const performedOnArr = this.widgetData.performed_on;

    const val = moment(performedOnArr[performedOnArr.length - 1]).diff(
      moment()
    );
    this.lastPerformedOn = Math.ceil(moment.duration(val).asDays());
  }

  openWidgetDetails() {

    // For sharing data between routes
    this.selectedWidgetService.setWidgetData(this.widgetData);

    this.router.navigate(['widget-details']);
  }
}
