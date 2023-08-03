import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
import { db, WidgetTypeM } from '../../data/db';
import * as moment from 'moment';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss'],
})
export class CreateNewComponent {
  // contains only the types of widgets
  widgetTypeList$: Observable<WidgetTypeM[]> = liveQuery(() =>
    db.widgetType.toArray()
  );

  widgetFormGroup = this.fb.group(
    {
      widgetType: ['', Validators.required],
      detail: ['', Validators.required],
      targetDate: [''],
    },
    {
      validators: [this.customValidator],
    }
  );

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

  constructor(private router: Router, private fb: FormBuilder) {}

  cancelAndBack() {
    // clearing the fields

    this.router.navigate(['home']);
  }

  async createWidget() {
    //
    console.log(this.widgetFormGroup);
    const widgetId = await db.widgetData
      .add({
        type: parseInt(this.widgetFormGroup.value.widgetType),
        detail: this.widgetFormGroup.value.detail,
        target_date: this.widgetFormGroup.value.targetDate,
        status: 1, // marking status as ongoing
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
    return this.widgetFormGroup.status==='INVALID';
  }
}
