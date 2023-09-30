import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
import { db, WidgetDataM, WidgetPriorityM, WidgetStatusM } from '../../data/db';
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
  widgetStatusList$: Observable<WidgetStatusM[]> = liveQuery(() =>
    db.widgetStatus.toArray()
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
      statusId: [1, Validators.required]
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
    console.log('widgetData : ', this.widgetData);

    this.setWidgetCurrentValues();
  }

  setWidgetCurrentValues() {
    this.widgetFormGroup.patchValue({
      detail: this.widgetData.detail,
      targetDate: moment(this.widgetData.target_date).format('yyyy-MM-DD'),
      priorityId: this.widgetData.priority_id,
      isHighlighted: this.widgetData.is_highlighted,
      color: this.widgetData.color,
      statusId: this.widgetData.status
    });
  }

  cancelAndBack() {
    // clearing the fields

    this.router.navigate(['home']);
  }

  async updateWidget() {
    //
    console.log(this.widgetFormGroup);

    if (!this.widgetData.id) {
      alert('Invalid Widget!');
      return;
    }
    await db.widgetData
      .update(this.widgetData.id, {
        // type: parseInt(this.widgetFormGroup.value.widgetType),
        priority_id: this.widgetFormGroup.value.priorityId,
        detail: this.widgetFormGroup.value.detail,
        target_date: this.widgetFormGroup.value.targetDate,
        status: this.widgetFormGroup.value.statusId, // marking status as ongoing
        color: this.widgetFormGroup.value.color,
        is_highlighted: this.widgetFormGroup.value.isHighlighted,
        created_on: moment().format(),
        last_edited_on: moment().format(),
      })
      .then(() => {
        alert(`Widget was updated successfully.`);
        this.widgetFormGroup.reset({
          widgetType: '',
          detail: '',
          targetDate: '',
        });
        this.router.navigate(['widget-details']);
      })
      .catch((err) => {
        throw err;
      });
  }

  isFormInvalid(): boolean {
    return this.widgetFormGroup.status === 'INVALID';
  }
}
