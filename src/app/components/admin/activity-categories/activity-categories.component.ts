import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditActivityCategoryModalComponent } from 'src/app/components/admin/activity-categories/edit-activity-category-modal/edit-activity-category-modal.component';
import { EditActivityModalComponent } from 'src/app/components/admin/activity-categories/edit-activity-modal/edit-activity-modal.component';
import { Activity } from 'src/app/models/activity';
import { ActivityCategory } from 'src/app/models/activityCategory';
import { ActivitiesService } from 'src/app/services/activities.service';
import { ActivityCategoriesService } from 'src/app/services/activityCategories.service';

@Component({
  selector: 'activity-categories',
  templateUrl: './activity-categories.component.html',
  styleUrls: ['./activity-categories.component.css']
})
export class ActivityCategoriesComponent implements OnInit, OnDestroy {
  activitiesSubscription?: Subscription;
  activityCategoriesSubscription?: Subscription;
  activityCategories: ActivityCategory[] = [];
  activities?: Activity[];
  closeModalResult = '';

  constructor(private activityCategoriesService: ActivityCategoriesService,
    private activitiesService: ActivitiesService,
    private modalService: NgbModal)
  {
  }

  ngOnInit() {
    this.getAllActivityCategories();
    this.getAllActivities();
  }

  ngOnDestroy() {
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }

    if (this.activityCategoriesSubscription) {
      this.activityCategoriesSubscription.unsubscribe();
    }
  }

  private getAllActivityCategories() {
    let activityCategoriesObserver = {
      next: (activityCategories: ActivityCategory[]) => this.activityCategories = activityCategories,
      error: (err: any) => this.logError('Error getting all activity categories.', err),
      complete: () => console.log('Activity Categories loaded.')
    };
    this.activityCategoriesSubscription = this.activityCategoriesService.getAllActivityCategories().subscribe(activityCategoriesObserver);
  }

  private getAllActivities() {
    let activitiesObserver = {
      next: (activities: Activity[]) => this.activities = activities,
      error: (err: any) => this.logError('Error getting all activities.', err),
      complete: () => console.log('Activities loaded.')
    };
    this.activitiesSubscription = this.activitiesService.getAllActivities().subscribe(activitiesObserver);
  }

  openCreateActivityCategoryModal() {
    const modalRef = this.modalService.open(EditActivityCategoryModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.modalHeaderText = 'Adding Activity Category';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: ActivityCategory) => {
      if (result) {
        this.activityCategories?.push(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Create Activity Category Modal.', error);
      }
    });
  }

  openEditActivityCategoryModal(activityCategory: ActivityCategory) {
    const modalRef = this.modalService.open(EditActivityCategoryModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activityCategory = activityCategory;
    modalRef.componentInstance.modalHeaderText = 'Editing Activity Category';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result) => {
      if (result) {
        this.updateActivityCategoryInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Activity Category Modal.');
        console.log(error);
      }
    });
  }

  private updateActivityCategoryInList(activityCategory: ActivityCategory) {
    let index = this.activityCategories?.findIndex(x => x.activityCategoryId == activityCategory.activityCategoryId)

    if (this.activityCategories && index !== undefined && index >= 0) {
      this.activityCategories[index] = activityCategory;
    }
  }

  openCreateActivityModal() {
    const modalRef = this.modalService.open(EditActivityModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});
    modalRef.componentInstance.activity = new Activity({
      activityCategoryId: this.activityCategories[0].activityCategoryId || 0,
      activityCoordinators: []
    });
    modalRef.componentInstance.activityCategories = this.activityCategories;
    modalRef.componentInstance.modalHeaderText = 'Creating Activity';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: Activity) => {
      if (result) {
        this.activities?.push(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Activity Modal.');
        console.log(error);
      }
    });
  }

  openEditActivityModal(activity: Activity) {
    const modalRef = this.modalService.open(EditActivityModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activity = activity;
    modalRef.componentInstance.activityCategories = this.activityCategories;
    modalRef.componentInstance.modalHeaderText = 'Editing Activity';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result: Activity) => {
      if (result) {
        this.updateActivityInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Edit Activity Modal.', error);
      }
    });
  }

  private updateActivityInList(activity: Activity) {
    let index = this.activities?.findIndex(x => x.activityId == activity.activityId)

    if (this.activities && index !== undefined && index >= 0) {
      this.activities[index] = activity;
    }
  }

  filterActivitiesByCategory(activityCategoryId?: number) {
    if (this.activities && activityCategoryId !== undefined) {
      return this.activities.filter(x => x.activityCategoryId == activityCategoryId).sort(function(a, b){
        if (a.activityName.toLowerCase() < b.activityName.toLowerCase()) {
          return -1;
        }

        if (a.activityName.toLowerCase() > b.activityName.toLowerCase()) {
          return 1;
        }

        return 0;
      });
    }

    return [];
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
