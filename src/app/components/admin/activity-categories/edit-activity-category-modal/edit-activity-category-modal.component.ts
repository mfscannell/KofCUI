import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { ActivityCategory } from 'src/app/models/activityCategory';
import { ActivityCategoriesService } from 'src/app/services/activityCategories.service';

@Component({
  selector: 'app-edit-activity-category-modal',
  templateUrl: './edit-activity-category-modal.component.html',
  styleUrls: ['./edit-activity-category-modal.component.css']
})
export class EditActivityCategoryModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() activityCategory?: ActivityCategory;
  updateActivityCategorySubscription?: Subscription;
  createActivityCategorySubscription?: Subscription;
  editActivityCategoryForm: FormGroup;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(public activeModal: NgbActiveModal,
    private activityCategoriesService: ActivityCategoriesService) {
    this.editActivityCategoryForm = new FormGroup({
      activityCategoryId: new FormControl(0),
      categoryName: new FormControl('', [
        Validators.required,
        Validators.maxLength(31)
      ])
    });
  }

  ngOnInit() {
    if (this.activityCategory) {
      this.editActivityCategoryForm.patchValue({
        activityCategoryId: this.activityCategory.activityCategoryId,
        categoryName: this.activityCategory.categoryName
       });
    }
  }

  ngOnDestroy() {
    if (this.updateActivityCategorySubscription) {
      this.updateActivityCategorySubscription.unsubscribe();
    }

    if (this.createActivityCategorySubscription) {
      this.createActivityCategorySubscription.unsubscribe();
    }
  }

  onSubmitEditActivityCategory() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updatedActivityCategory = new ActivityCategory(this.editActivityCategoryForm.getRawValue());

      this.updateActivityCategory(updatedActivityCategory);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let newActivityCategory = new ActivityCategory(this.editActivityCategoryForm.getRawValue());
      this.createActivityCategory(newActivityCategory);
    }
  }

  private updateActivityCategory(activityCategory: ActivityCategory) {
    let activityCategoryObserver = {
      next: (activityCategory: ActivityCategory) => this.passBack(activityCategory),
      error: (err: any) => this.logError('Error updating Activity Category', err),
      complete: () => console.log('Activity Category updated.')
    };

    this.updateActivityCategorySubscription = this.activityCategoriesService.updateActivityCategory(activityCategory).subscribe(activityCategoryObserver);
  }

  private createActivityCategory(activityCategory: ActivityCategory) {
    let activityCategoryObserver = {
      next: (createdActivityCategory: ActivityCategory) => this.passBack(createdActivityCategory),
      error: (err: any) => this.logError('Error creating Activity Category', err),
      complete: () => console.log('Activity Category created.')
    };

    this.createActivityCategorySubscription = this.activityCategoriesService.createActivityCategory(activityCategory).subscribe(activityCategoryObserver);
  }

  passBack(activityCategory: ActivityCategory) {
    this.activeModal.close(activityCategory);
  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (let key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.errorSaving = true;
  }
}
