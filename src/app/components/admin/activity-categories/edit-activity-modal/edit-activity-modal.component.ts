import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditActivityCoordinatorFormGroup } from 'src/app/forms/editActivityCoordinatorFormGroup';
import { EditActivityModelFormGroup } from 'src/app/forms/editActivityModelFormGroup';
import { Activity } from 'src/app/models/activity';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { Knight } from 'src/app/models/knight';
import { CreateActivityRequest } from 'src/app/models/requests/createActivityRequest';
import { UpdateActivityRequest } from 'src/app/models/requests/updateActivityRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { ActivitiesService } from 'src/app/services/activities.service';

@Component({
  selector: 'edit-activity-modal',
  templateUrl: './edit-activity-modal.component.html',
  styleUrls: ['./edit-activity-modal.component.scss'],
})
export class EditActivityModalComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('cancelEditActivityModal', { static: false }) cancelEditActivityModal: ElementRef | undefined;

  @Input() allKnights: Knight[] = [];
  @Input() activityCategoryFormOptions: GenericFormOption[] = [];
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Output() createActivityChanges = new EventEmitter<Activity>();
  @Output() editActivityChanges = new EventEmitter<Activity>();

  public activity?: Activity;
  public editActivityForm: FormGroup<EditActivityModelFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private updateActivitySubscription?: Subscription;
  private createActivitySubscription?: Subscription;

  constructor(private activitiesService: ActivitiesService) {
    this.editActivityForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.updateActivitySubscription) {
      this.updateActivitySubscription.unsubscribe();
    }

    if (this.createActivitySubscription) {
      this.createActivitySubscription.unsubscribe();
    }
  }

  ngOnChanges() {
  }

  public resetForm(activity?: Activity) {
    this.editActivityForm = this.initForm();
    this.editActivityForm.markAsPristine();
    this.editActivityForm.markAsUntouched();

    if (activity) {
      this.activity = activity;
      this.patchForm(activity);
    }
  }

  private initForm() {
    return new FormGroup<EditActivityModelFormGroup>({
      id: new FormControl<string>('00000000-0000-0000-0000-000000000000', {nonNullable: true}),
      activityName: new FormControl<string>('', { nonNullable:true, validators: [Validators.required, Validators.maxLength(127)] }),
      activityDescription: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(255)] }),
      activityCategory: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      activityCoordinatorsList: new FormArray<FormGroup<EditActivityCoordinatorFormGroup>>([]),
      notes: new FormControl<string>('', { nonNullable: true }),
    });
  }

  private patchForm(activity: Activity) {
    this.editActivityForm.patchValue({
      id: activity.activityId,
      activityName: activity.activityName,
      activityDescription: activity.activityDescription,
      activityCategory: activity.activityCategory,
      notes: activity.notes,
    });

    activity.activityCoordinators.map((coordinator) => {
      const activityCoordinatorFg = new FormGroup<EditActivityCoordinatorFormGroup>({
        knightId: new FormControl<string>(coordinator, { nonNullable: true }),
      });
      this.editActivityForm.controls.activityCoordinatorsList.controls.push(activityCoordinatorFg);
    });
  }

  public deleteActivityCoordinator(roleIndex: number) {
    const activityCoordinators = this.editActivityForm.controls['activityCoordinatorsList'] as FormArray<FormGroup<EditActivityCoordinatorFormGroup>>;

    activityCoordinators.removeAt(roleIndex);
  }

  public addActivityCoordinator() {
    const activityCoordinator = new FormGroup<EditActivityCoordinatorFormGroup>({
      knightId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    });

    const activityCoordinators = this.editActivityForm.controls['activityCoordinatorsList'] as FormArray<FormGroup<EditActivityCoordinatorFormGroup>>;

    activityCoordinators.push(activityCoordinator);
  }

  public cancelModal() {
    this.errorSaving = false;
    this.errorMessages = [];
  }

  public onSubmitEditActivity() {
    if (this.modalAction === ModalActionEnums.Edit) {
      const updatedActivity = this.mapFormToUpdateActivityRequest();
      this.updateActivity(updatedActivity);
    } else if (this.modalAction === ModalActionEnums.Create) {
      const newActivity = this.mapFormToCreateActivityRequest();
      this.createActivity(newActivity);
    }
  }

  private mapFormToCreateActivityRequest(): CreateActivityRequest {
    const activityCoordinators = this.editActivityForm.controls.activityCoordinatorsList.controls.map((activityCoordinatorFormGroup: FormGroup<EditActivityCoordinatorFormGroup>) => {
      return activityCoordinatorFormGroup.controls.knightId.value;
    });
    const activity: CreateActivityRequest = {
      activityName: this.editActivityForm.controls.activityName.value,
      activityDescription: this.editActivityForm.controls.activityDescription.value,
      activityCategory: this.editActivityForm.controls.activityCategory.value,
      activityCoordinators: activityCoordinators,
      notes: this.editActivityForm.controls.notes.value,
    };

    console.log(activity);

    return activity;
  }

  private mapFormToUpdateActivityRequest(): UpdateActivityRequest {
    const activityCoordinators = this.editActivityForm.controls.activityCoordinatorsList.controls.map((activityCoordinatorFormGroup: FormGroup<EditActivityCoordinatorFormGroup>) => {
      return activityCoordinatorFormGroup.controls.knightId.value;
    });
    const activity: UpdateActivityRequest = {
      activityId: this.editActivityForm.controls.id.value,
      activityName: this.editActivityForm.controls.activityName.value,
      activityDescription: this.editActivityForm.controls.activityDescription.value,
      activityCategory: this.editActivityForm.controls.activityCategory.value,
      activityCoordinators: activityCoordinators,
      notes: this.editActivityForm.controls.notes.value,
    };

    return activity;
  }

  private updateActivity(activity: UpdateActivityRequest) {
    const activityObserver = {
      next: (updatedActivity: Activity) => this.passBackUpdatedActivity(updatedActivity),
      error: (err: ApiResponseError) => this.logError('Error updating Activity', err),
      complete: () => console.log('Activity updated.'),
    };

    this.updateActivitySubscription = this.activitiesService.updateActivity(activity).subscribe(activityObserver);
  }

  private passBackUpdatedActivity(updatedActivity: Activity) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editActivityChanges.emit(updatedActivity);
    this.updateActivitySubscription?.unsubscribe();
    this.cancelEditActivityModal?.nativeElement.click();
  }

  private createActivity(activity: CreateActivityRequest) {
    const activityObserver = {
      next: (createdActivity: Activity) => this.passBackCreatedActivity(createdActivity),
      error: (err: ApiResponseError) => this.logError('Error creating Activity', err),
      complete: () => console.log('Activity created.'),
    };

    this.createActivitySubscription = this.activitiesService.createActivity(activity).subscribe(activityObserver);
  }

  private passBackCreatedActivity(createdActivity: Activity) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.createActivityChanges.emit(createdActivity);
    this.createActivitySubscription?.unsubscribe();
    this.cancelEditActivityModal?.nativeElement.click();
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorSaving = true;
  }
}
