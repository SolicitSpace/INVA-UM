import { Component, Input, OnInit } from '@angular/core';
import { WidgetDataM } from 'src/app/data/db';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SelectedWidgetService } from '../../services/selected-widget.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent {
  @Input() widgetData!: WidgetDataM;

  detail: string = 'NA';
  timeVal: number = 0;

  constructor(
    private router: Router,
    private selectedWidgetService: SelectedWidgetService
  ) {}

  ngOnInit(): void {
    console.log('this.widgetData : ', this.widgetData);
    this.detail = this.widgetData.detail;

    // if no target date is set then count the number of dayys from creation
    if (this.widgetData.target_date == '') this.setDaysPassed();
    else this.setDaysPending();

    console.log(this.widgetData);
  }

  setDaysPassed() {
    // For now used created on later will use the first date from implemented on
    const val = moment(this.widgetData.created_on, 'YYYY-MM-DD').diff(moment());

    this.timeVal = Math.ceil(moment.duration(val).asDays());
    this.timeVal = Math.abs(this.timeVal);
  }
  setDaysPending() {
    const val = moment(this.widgetData.target_date, 'YYYY-MM-DD').diff(
      moment()
    );
    
    this.timeVal = Math.ceil(moment.duration(val).asDays());
  }

  openWidgetDetails() {
    this.selectedWidgetService.setWidgetData(this.widgetData);
    this.router.navigate(['widget-details']);
  }
}
