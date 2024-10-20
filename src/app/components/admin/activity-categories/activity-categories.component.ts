import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FormsService } from 'src/app/services/forms.service';
import { ActivityCategoryFormOption } from 'src/app/models/inputOptions/activityCategoryFormOption';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { ActivityCoordinator } from 'src/app/models/activityCoordinator';

@Component({
  selector: 'activity-categories',
  templateUrl: './activity-categories.component.html',
  styleUrls: ['./activity-categories.component.scss']
})
export class ActivityCategoriesComponent implements OnInit, OnDestroy {
  getDataSubscription?: Subscription;
  activitiesSubscription?: Subscription;
  updateActivitySubscription?: Subscription;
  createActivitySubscription?: Subscription;
  allKnights: Knight[] = [];
  activityCategoryFormOptions: ActivityCategoryFormOption[] = [];
  activities?: Activity[];
  closeModalResult = '';

  @ViewChild('cancelEditActiveModal', {static: false}) cancelEditActiveModal: ElementRef | undefined;
  modalAction: ModalActionEnums = ModalActionEnums.Create;
  editActivityForm: UntypedFormGroup;
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
    this.editActivityForm = new UntypedFormGroup({});
    this.initializeForm();
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

    if (this.updateActivitySubscription) {
      this.updateActivitySubscription.unsubscribe();
    }

    if (this.createActivitySubscription) {
      this.createActivitySubscription.unsubscribe();
    }
  }

  initializeForm() {
    this.editActivityForm = new UntypedFormGroup({
      activityId: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      activityName: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(127)
      ]),
      activityDescription: new UntypedFormControl('', [
        Validators.maxLength(255)
      ]),
      activityCategory: new UntypedFormControl(null, [
        Validators.required
      ]),
      activityCoordinatorsList: new UntypedFormArray([]),
      activityEventNotesList: new UntypedFormArray([]),
      notes: new UntypedFormControl('')
    });
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
    this.initializeForm();
  }

  openEditActivityModal(activity: Activity) {
    this.modalHeaderText = 'Editing Activity';
    this.activity = activity;
    this.modalAction = ModalActionEnums.Edit;
    this.initializeForm();

    this.editActivityForm.patchValue({
      activityId: this.activity.activityId,
      activityName: this.activity.activityName,
      activityDescription: this.activity.activityDescription,
      activityCategory: this.activity.activityCategory,
      notes: this.activity.notes
     });

     let activityCoordinatorsList = this.editActivityForm.get('activityCoordinatorsList') as UntypedFormArray;

     this.activity.activityCoordinators.map(function(coordinator) {
      const activityCoordinatorFg = new UntypedFormGroup({
        id: new UntypedFormControl(coordinator.id),
        knightId: new UntypedFormControl(coordinator.knightId)
      });
       activityCoordinatorsList.push(activityCoordinatorFg);
     });

     let activityEventNotes = this.editActivityForm.get('activityEventNotesList') as UntypedFormArray;

     this.activity.activityEventNotes.map(function(note) {
      const activityEventNotesFg = new UntypedFormGroup({
        startDateTime: new UntypedFormControl(note.startDateTime),
        notes: new UntypedFormControl(note.notes)
      });
       activityEventNotes.push(activityEventNotesFg);
     });
  }

  deleteActivityCoordinator(roleIndex: number) {
    let activityCoordinators = this.editActivityForm.controls["activityCoordinatorsList"] as UntypedFormArray;
    
    activityCoordinators.removeAt(roleIndex);
  }

  addActivityCoordinator() {
    const activityCoordinator = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      knightId: new UntypedFormControl(null, [
        Validators.required
      ])
    });

    let activityCoordinators = this.editActivityForm.controls["activityCoordinatorsList"] as UntypedFormArray;

    activityCoordinators.push(activityCoordinator);
  }

  onSubmitEditActivity() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updatedActivity = this.mapFormToActivity();
      this.updateActivity(updatedActivity);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let newActivity = this.mapFormToActivity();
      this.createActivity(newActivity);
    }
  }

  private updateActivity(activity: Activity) {
    let activityObserver = {
      next: (updatedActivity: Activity) => this.updateActivityInList(updatedActivity),
      error: (err: any) => this.logError('Error updating Activity', err),
      complete: () => console.log('Activity updated.')
    };

    this.updateActivitySubscription = this.activitiesService.updateActivity(activity).subscribe(activityObserver);
  }

  private createActivity(activity: Activity) {
    let activityObserver = {
      next: (createdActivity: Activity) => this.addActivityToList(createdActivity),
      error: (err: any) => this.logError('Error creating Activity', err),
      complete: () => console.log('Activity created.')
    };

    this.createActivitySubscription = this.activitiesService.createActivity(activity).subscribe(activityObserver);
  }

  cancelModal() {

  }

  private mapFormToActivity() {
    let rawForm = this.editActivityForm.getRawValue();
    let activityCoordinators = rawForm?.activityCoordinatorsList.map(function(coordinator: any) {
      let activityCoordinator: ActivityCoordinator = {
        id: coordinator.id,
        knightId: coordinator.knightId
      };
      return activityCoordinator;
    });
    let activity: Activity = {
      activityId: rawForm.activityId,
      activityName: rawForm.activityName,
      activityDescription: rawForm.activityDescription,
      activityCategory: rawForm.activityCategory,
      activityCoordinators: activityCoordinators,
      activityEventNotes: [],
      notes: rawForm.notes
    };

    return activity;
  }

  get activityCoordinators() {
    return this.editActivityForm.controls["activityCoordinatorsList"] as UntypedFormArray;
  }

  get activityEventNotes() {
    return this.editActivityForm.controls["activityEventNotesList"] as UntypedFormArray;
  }

  formatEventStartDate(index: number) {
    return DateTimeFormatter.ToDisplayedDate(this.activity?.activityEventNotes[index].startDateTime);
  }

  getEventNotes(index: number) {
    return this.activity?.activityEventNotes[index].notes;
  }

  private addActivityToList(activity: Activity) {
    this.activities?.push(activity);
    console.log('addActivityToList');
    console.log(this.activities);
    this.cancelEditActiveModal?.nativeElement.click();
  }

  private updateActivityInList(activity: Activity) {
    let index = this.activities?.findIndex(x => x.activityId == activity.activityId)

    if (this.activities && index !== undefined && index >= 0) {
      this.activities[index] = activity;
      this.cancelEditActiveModal?.nativeElement.click();
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
