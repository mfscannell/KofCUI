import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { FormsService } from 'src/app/services/forms.service';
import { ActivityCategoryFormOption } from 'src/app/models/inputOptions/activityCategoryFormOption';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';

@Component({
  selector: 'activity-categories',
  templateUrl: './activity-categories.component.html',
  styleUrls: ['./activity-categories.component.scss']
})
export class ActivityCategoriesComponent implements OnInit, OnDestroy {
  getDataSubscription?: Subscription;
  activitiesSubscription?: Subscription;
  allKnights: Knight[] = [];
  activityCategoryFormOptions: ActivityCategoryFormOption[] = [];
  activities?: Activity[];
  closeModalResult = '';

  modalAction: ModalActionEnums = ModalActionEnums.Create;
  modalHeaderText: string = '';
  activity: Activity | undefined;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    private formsService: FormsService,
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService,
    private permissionsService: PermissionsService)
  {
  }

  ngOnInit() {
    this.getFormOptions();
  }

  ngOnDestroy() {
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }

    if (this.getDataSubscription) {
      this.getDataSubscription.unsubscribe();
    }
  }

  canAddActivity() {
    return this.permissionsService.canAddActivity();
  }

  canEditActivity(activityId?: string) {
    return this.permissionsService.canEditActivity(activityId);
  }

  private getFormOptions() {
    let getDataObserver = {
      next: ([activities, activityCategoryFormOptions, allKnights]: [Activity[], ActivityCategoryFormOption[], Knight[]]) => {
        this.activities = activities,
        this.activityCategoryFormOptions = activityCategoryFormOptions,
        this.allKnights = allKnights
      },
      error: (err: any) => this.logError("Error getting Activity Form Options", err),
      complete: () => console.log('Activity Form Options retrieved.')
    };

    this.getDataSubscription = forkJoin([
      this.activitiesService.getAllActivities(),
      this.formsService.getActivityCategoryFormOptions(),
      this.knightsService.getAllActiveKnightsNames()
    ]).subscribe(getDataObserver);
  }

  openCreateActivityModal() {
    this.modalHeaderText = 'Creating Activity';
    this.activity = {
      activityName: '',
      activityDescription: '',
      activityCategory: this.activityCategoryFormOptions[0].value,
      activityCoordinators: [],
      activityEventNotes: [],
      notes: ''
    };
    this.modalAction = ModalActionEnums.Create;
  }

  openEditActivityModal(activity: Activity) {
    this.modalHeaderText = 'Editing Activity';
    this.activity = activity;
    this.modalAction = ModalActionEnums.Edit;
  }

  public addActivityToList(activity: Activity) {
    this.activities?.push(activity);
    console.log('addActivityToList');
    console.log(this.activities);
  }

  public updateActivityInList(activity: Activity) {
    let index = this.activities?.findIndex(x => x.activityId == activity.activityId)

    if (this.activities && index !== undefined && index >= 0) {
      this.activities[index] = activity;
    }
  }

  filterActivitiesByCategory(activityCategoryValue: string) {
    if (this.activities) {
      return this.activities.filter(x => x.activityCategory === activityCategoryValue).sort(function(a, b){
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
