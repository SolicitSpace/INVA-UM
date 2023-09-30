import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
import { db, WidgetDataM, WidgetPriorityM } from '../../data/db';
import * as moment from 'moment';
import { SelectedWidgetService } from '../../services/selected-widget.service';

@Component({
  selector: 'app-edit-widget',
  templateUrl: './edit-widget.component.html',
  styleUrls: ['./edit-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // to prevent calling the isFormValid method periodically
})
export class EditWidgetComponent implements OnInit {
  widgetData: WidgetDataM = this.selectedWidgetService.getWidgetData();

  // contains only the types of widgets
  widgetPriorityList$: Observable<WidgetPriorityM[]> = liveQuery(() =>
    db.widgetPriority.toArray()
  );
  // widgetTypeList$: Observable<WidgetTypeM[]> = liveQuery(() =>
  //   db.widgetType.toArray()
  // );

  widgetFormGroup = this.fb.group(
    {
      detail: ['', Validators.required],
      targetDate: [''],
      priorityId: [1, Validators.required],
      isHighlighted: [false],
      color: [''],
    },
    {
      validators: [this.customValidator],
    }
  );

  clicked() {
    console.log(this.widgetFormGroup.value);
  }
  customValidator(formGroup: FormGroup): ValidationErrors | null {
    if (!formGroup.value.detail) return null;
    if (formGroup.value.detail.trim() == '')
      return { detail_error: 'Detail cannot be empty' };

    // For countdown
    if (
      formGroup.value.widgetType == 1 &&
      formGroup.value.targetDate.trim() == ''
    )
      return {
        countdown_error: 'Target date not set for countdown widget type',
      };

    return null;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private selectedWidgetService: SelectedWidgetService
  ) {}
  ngOnInit(): void {

    this.setWidgetCurrentValues();  
  }

  setWidgetCurrentValues() {
    this.widgetFormGroup.patchValue({
      detail: this.widgetData.detail,
      targetDate: this.widgetData.target_date,
      priorityId: this.widgetData.priority_id,
      isHighlighted: this.widgetData.is_highlighted,
      color: this.widgetData.color,
    });

    // Will have to figure out how to apply values properly to all fields
  }

  cancelAndBack() {
    // clearing the fields

    this.router.navigate(['home']);
  }

  async createWidget() {
    //
    console.log(this.widgetFormGroup);
    const widgetId = await db.widgetData
      .add({
        // type: parseInt(this.widgetFormGroup.value.widgetType),
        priority_id: this.widgetFormGroup.value.priorityId,
        detail: this.widgetFormGroup.value.detail,
        target_date: this.widgetFormGroup.value.targetDate,
        status: 1, // marking status as ongoing
        performed_on: [],
        color: this.widgetFormGroup.value.color,
        is_highlighted: this.widgetFormGroup.value.isHighlighted,
        created_on: moment().format(),
        last_edited_on: moment().format(),
      })
      .catch((err) => {
        throw err;
      });

    alert(
      `Widget was created successfully. \nYou've created ${widgetId} widget till now. \nKeep it up!`
    );

    this.widgetFormGroup.reset({ widgetType: '', detail: '', targetDate: '' });
  }

  isFormInvalid(): boolean {
    return this.widgetFormGroup.status === 'INVALID';
  }
}
