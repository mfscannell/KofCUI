import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditActivityModalComponent } from 'src/app/components/admin/activity-categories/edit-activity-modal/edit-activity-modal.component';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { ActivityCategoryEnums } from 'src/app/enums/activityCategoryEnums';

@Component({
  selector: 'activity-categories',
  templateUrl: './activity-categories.component.html',
  styleUrls: ['./activity-categories.component.scss']
})
export class ActivityCategoriesComponent implements OnInit, OnDestroy {
  activitiesSubscription?: Subscription;
  activityCategories: ActivityCategoryEnums[] = Object.values(ActivityCategoryEnums);
  activities?: Activity[];
  closeModalResult = '';

  constructor(private activitiesService: ActivitiesService,
    private permissionsService: PermissionsService,
    private modalService: NgbModal)
  {
  }

  ngOnInit() {
    this.getAllActivities();
  }

  ngOnDestroy() {
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }
  }

  canAddActivity() {
    return this.permissionsService.canAddActivity();
  }

  canEditActivity(activityId?: number) {
    return this.permissionsService.canEditActivity(activityId);
  }

  private getAllActivities() {
    let activitiesObserver = {
      next: (activities: Activity[]) => this.activities = activities,
      error: (err: any) => this.logError('Error getting all activities.', err),
      complete: () => console.log('Activities loaded.')
    };
    this.activitiesSubscription = this.activitiesService.getAllActivities().subscribe(activitiesObserver);
  }

  openCreateActivityModal() {
    const modalRef = this.modalService.open(EditActivityModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});
    modalRef.componentInstance.activity = new Activity({
      activityCategory: this.activityCategories[0],
      activityCoordinators: [],
      activityEventNotes: []
    });
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

  filterActivitiesByCategory(activityCategory: ActivityCategoryEnums) {
    if (this.activities) {
      return this.activities.filter(x => x.activityCategory === activityCategory).sort(function(a, b){
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
