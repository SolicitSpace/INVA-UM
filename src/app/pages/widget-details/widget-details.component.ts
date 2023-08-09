import { Component, OnInit } from '@angular/core';
import { SelectedWidgetService } from '../../services/selected-widget.service';
import { Router } from '@angular/router';
import { WidgetDataM, WidgetStatusM, WidgetTypeM } from 'src/app/data/db';

import * as moment from 'moment';
import { db } from '../../data/db';

@Component({
  selector: 'app-widget-details',
  templateUrl: './widget-details.component.html',
  styleUrls: ['./widget-details.component.scss'],
})
export class WidgetDetailsComponent implements OnInit {
  widgetData: WidgetDataM = this.selectedWidgetService.getWidgetData();

  statusVal: string = 'NA';
  typeVal: string = 'NA';

  constructor(
    private selectedWidgetService: SelectedWidgetService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('++> ', this.widgetData);
    this.handleInvalidState();

    this.setValueForStatus();
    this.setValueForType();
  }

  async setValueForStatus() {
    const statusObj: WidgetStatusM[] = await db.widgetStatus
      .where({ id: this.widgetData.status })
      .toArray();

    console.log(statusObj);
    this.statusVal = statusObj[0].value;
  }

  async setValueForType() {
    const typeObj: WidgetTypeM[] = await db.widgetType
      .where({ id: this.widgetData.type })
      .toArray();

    this.typeVal = typeObj[0].value;
  }

  handleInvalidState() {
    if (!this.selectedWidgetService.getWidgetData())
      this.router.navigate(['home']);
  }
}
