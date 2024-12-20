import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import * as _ from "lodash";

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { FormsService } from 'src/app/services/forms.service';
import { KnightsService } from 'src/app/services/knights.service';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { EditActivityModalComponent } from './edit-activity-modal/edit-activity-modal.component';
import { KnightName } from 'src/app/models/knightName';

@Component({
  selector: 'activity-categories',
  templateUrl: './activity-categories.component.html',
  styleUrls: ['./activity-categories.component.scss'],
})
export class ActivityCategoriesComponent implements OnInit, OnDestroy {
  @ViewChild(EditActivityModalComponent) editActivityModal: EditActivityModalComponent | undefined;
  getDataSubscription?: Subscription;
  activitiesSubscription?: Subscription;
  allKnights: KnightName[] = [];
  activityCategoryFormOptions: GenericFormOption[] = [];
  activities: Activity[] = [];
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
    private permissionsService: PermissionsService,
  ) {}

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
    const getDataObserver = {
      next: ([activities, activityCategoryFormOptions, allKnights]: [Activity[], GenericFormOption[], KnightName[]]) => {
        this.activities = activities;
        this.activityCategoryFormOptions = activityCategoryFormOptions;
        this.allKnights = allKnights;
      },
      error: (err: ApiResponseError) => this.logError('Error getting Activity Form Options', err),
      complete: () => console.log('Activity Form Options retrieved.'),
    };

    this.getDataSubscription = forkJoin([
      this.activitiesService.getAllActivities(),
      this.formsService.getActivityCategoryFormOptions(),
      this.knightsService.getAllKnightsNames({restrictToActiveOnly: true}),
    ]).subscribe(getDataObserver);
  }

  openCreateActivityModal() {
    this.modalHeaderText = 'Creating Activity';
    this.modalAction = ModalActionEnums.Create;
    this.editActivityModal?.resetForm();
  }

  openEditActivityModal(activity: Activity) {
    this.modalHeaderText = 'Editing Activity';
    this.activity = activity;
    this.modalAction = ModalActionEnums.Edit;
    this.editActivityModal?.resetForm(this.activity);
  }

  public addActivityToList(activity: Activity) {
    const newList = _.cloneDeep(this.activities) as Activity[];
    newList.push(activity);
    this.activities = newList;
    console.log('addActivityToList');
    console.log(this.activities);
  }

  public updateActivityInList(activity: Activity) {
    const newList = _.cloneDeep(this.activities) as Activity[];
    const index = newList.findIndex((x) => x.activityId == activity.activityId);

    if (newList && index !== undefined && index >= 0) {
      newList[index] = activity;

      this.activities = newList;
    }
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else if (Array.isArray(err?.error)) {
      err?.error.forEach((e: string) => {
        this.errorMessages.push(e);
      });
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorSaving = true;
  }
}
