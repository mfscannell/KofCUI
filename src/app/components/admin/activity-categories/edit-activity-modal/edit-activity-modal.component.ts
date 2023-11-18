import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Activity } from 'src/app/models/activity';
import { Knight } from 'src/app/models/knight';
import { ActivitiesService } from 'src/app/services/activities.service';
import { KnightsService } from 'src/app/services/knights.service';
import { ActivityCoordinator } from 'src/app/models/activityCoordinator';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';

@Component({
  selector: 'app-edit-activity-modal',
  templateUrl: './edit-activity-modal.component.html',
  styleUrls: ['./edit-activity-modal.component.scss']
})
export class EditActivityModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() activity?: Activity;
  activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  allKnights: Knight[] = [];
  updateActivitySubscription?: Subscription;
  createActivitySubscription?: Subscription;
  getAllKnightsSubscription?: Subscription;
  editActivityForm: UntypedFormGroup;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(public activeModal: NgbActiveModal,
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService) {
    this.editActivityForm = new UntypedFormGroup({
      activityId: new UntypedFormControl(0),
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

    this.getAllActiveKnightsNames();
  }

  ngOnInit() {
    if (this.activity) {
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
          activityCoordinatorId: new UntypedFormControl(coordinator.activityCoordinatorId),
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
  }

  ngOnDestroy() {
    if (this.updateActivitySubscription) {
      this.updateActivitySubscription.unsubscribe();
    }

    if (this.createActivitySubscription) {
      this.createActivitySubscription.unsubscribe();
    }

    if (this.getAllKnightsSubscription) {
      this.getAllKnightsSubscription.unsubscribe();
    }
  }

  private getAllActiveKnightsNames() {
    let knightsObserver = {
      next: (knights: Knight[]) => this.allKnights = knights,
      error: (err: any) => this.logError('Error getting all knights.', err),
      complete: () => console.log('Knights updated.')
    };

    this.getAllKnightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
  }

  get activityCoordinators() {
    return this.editActivityForm.controls["activityCoordinatorsList"] as UntypedFormArray;
  }

  get activityEventNotes() {
    return this.editActivityForm.controls["activityEventNotesList"] as UntypedFormArray;
  }

  addActivityCoordinator() {
    const activityCoordinator = new UntypedFormGroup({
      activityCoordinatorId: new UntypedFormControl(0),
      knightId: new UntypedFormControl(null, [
        Validators.required
      ])
    });

    let activityCoordinators = this.editActivityForm.controls["activityCoordinatorsList"] as UntypedFormArray;

    activityCoordinators.push(activityCoordinator);
  }

  deleteActivityCoordinator(roleIndex: number) {
    let activityCoordinators = this.editActivityForm.controls["activityCoordinatorsList"] as UntypedFormArray;
    
    activityCoordinators.removeAt(roleIndex);
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

  private mapFormToActivity() {
    let rawForm = this.editActivityForm.getRawValue();
    let activityCoordinators = rawForm?.activityCoordinatorsList.map(function(coordinator: any) {
      return new ActivityCoordinator({
        activityCoordinatorId: coordinator.activityCoordinatorId,
        knightId: coordinator.knightId
      });
    });
    let activity = new Activity({
      activityId: rawForm.activityId,
      activityName: rawForm.activityName,
      activityDescription: rawForm.activityDescription,
      activityCategory: rawForm.activityCategory,
      activityCoordinators: activityCoordinators,
      activityEventNotes: [],
      notes: rawForm.notes
    });

    return activity;
  }

  private updateActivity(activity: Activity) {
    let activityObserver = {
      next: (updatedActivity: Activity) => this.passBack(updatedActivity),
      error: (err: any) => this.logError('Error updating Activity', err),
      complete: () => console.log('Activity updated.')
    };

    this.updateActivitySubscription = this.activitiesService.updateActivity(activity).subscribe(activityObserver);
  }

  private createActivity(activity: Activity) {
    let activityObserver = {
      next: (createdActivity: Activity) => this.passBack(createdActivity),
      error: (err: any) => this.logError('Error creating Activity', err),
      complete: () => console.log('Activity created.')
    };

    this.createActivitySubscription = this.activitiesService.createActivity(activity).subscribe(activityObserver);
  }

  passBack(activity: Activity) {
    this.activeModal.close(activity);
  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);
    console.error(err?.error.errors);
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
