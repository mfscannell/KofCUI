import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { Activity } from 'src/app/models/activity';
import { ActivityCoordinator } from 'src/app/models/activityCoordinator';
import { ActivityCoordinatorFormGroup } from 'src/app/models/formControls/activityCoordinatorFormGroup';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { Knight } from 'src/app/models/knight';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { ActivitiesService } from 'src/app/services/activities.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'edit-activity-modal',
  templateUrl: './edit-activity-modal.component.html',
  styleUrls: ['./edit-activity-modal.component.scss'],
})
export class EditActivityModalComponent
  implements OnInit, OnDestroy, OnChanges
{
  @ViewChild('cancelEditActivityModal', { static: false })
  cancelEditActivityModal: ElementRef | undefined;

  @Input() activity: Activity | undefined;
  @Input() allKnights: Knight[] = [];
  @Input() activityCategoryFormOptions: GenericFormOption[] = [];
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Output() createActivityChanges = new EventEmitter<Activity>();
  @Output() editActivityChanges = new EventEmitter<Activity>();

  public editActivityForm: UntypedFormGroup;
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
    this.editActivityForm = this.initForm();

    if (this.activity) {
      this.editActivityForm.patchValue({
        activityId: this.activity.activityId,
        activityName: this.activity.activityName,
        activityDescription: this.activity.activityDescription,
        activityCategory: this.activity.activityCategory,
        notes: this.activity.notes,
      });

      const activityCoordinatorsList = this.editActivityForm.get(
        'activityCoordinatorsList',
      ) as UntypedFormArray;

      this.activity.activityCoordinators.map(function (coordinator) {
        const activityCoordinatorFg = new UntypedFormGroup({
          id: new UntypedFormControl(coordinator.id),
          knightId: new UntypedFormControl(coordinator.knightId),
        });
        activityCoordinatorsList.push(activityCoordinatorFg);
      });

      const activityEventNotes = this.editActivityForm.get(
        'activityEventNotesList',
      ) as UntypedFormArray;

      this.activity.activityEventNotes.map(function (note) {
        const activityEventNotesFg = new UntypedFormGroup({
          startDateTime: new UntypedFormControl(note.startDateTime),
          notes: new UntypedFormControl(note.notes),
        });
        activityEventNotes.push(activityEventNotesFg);
      });
    }
  }

  private initForm() {
    return new UntypedFormGroup({
      activityId: new UntypedFormControl(
        '00000000-0000-0000-0000-000000000000',
      ),
      activityName: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(127),
      ]),
      activityDescription: new UntypedFormControl('', [
        Validators.maxLength(255),
      ]),
      activityCategory: new UntypedFormControl(null, [Validators.required]),
      activityCoordinatorsList: new UntypedFormArray([]),
      activityEventNotesList: new UntypedFormArray([]),
      notes: new UntypedFormControl(''),
    });
  }

  public deleteActivityCoordinator(roleIndex: number) {
    const activityCoordinators = this.editActivityForm.controls[
      'activityCoordinatorsList'
    ] as UntypedFormArray;

    activityCoordinators.removeAt(roleIndex);
  }

  public addActivityCoordinator() {
    const activityCoordinator = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      knightId: new UntypedFormControl(null, [Validators.required]),
    });

    const activityCoordinators = this.editActivityForm.controls[
      'activityCoordinatorsList'
    ] as UntypedFormArray;

    activityCoordinators.push(activityCoordinator);
  }

  get activityCoordinators() {
    return this.editActivityForm.controls[
      'activityCoordinatorsList'
    ] as UntypedFormArray;
  }

  get activityEventNotes() {
    return this.editActivityForm.controls[
      'activityEventNotesList'
    ] as UntypedFormArray;
  }

  public formatEventStartDate(index: number) {
    return DateTimeFormatter.ToDisplayedDate(
      this.activity?.activityEventNotes[index].startDateTime,
    );
  }

  public getEventNotes(index: number) {
    return this.activity?.activityEventNotes[index].notes;
  }

  public cancelModal() {}

  public onSubmitEditActivity() {
    if (this.modalAction === ModalActionEnums.Edit) {
      const updatedActivity = this.mapFormToActivity();
      this.updateActivity(updatedActivity);
    } else if (this.modalAction === ModalActionEnums.Create) {
      const newActivity = this.mapFormToActivity();
      this.createActivity(newActivity);
    }
  }

  private mapFormToActivity() {
    const rawForm = this.editActivityForm.getRawValue();
    const activityCoordinators = rawForm?.activityCoordinatorsList.map(
      function (coordinator: ActivityCoordinatorFormGroup) {
        const activityCoordinator: ActivityCoordinator = {
          id: coordinator.id,
          knightId: coordinator.knightId,
        };
        return activityCoordinator;
      },
    );
    const activity: Activity = {
      activityId: rawForm.activityId,
      activityName: rawForm.activityName,
      activityDescription: rawForm.activityDescription,
      activityCategory: rawForm.activityCategory,
      activityCoordinators: activityCoordinators,
      activityEventNotes: [],
      notes: rawForm.notes,
    };

    return activity;
  }

  private updateActivity(activity: Activity) {
    const activityObserver = {
      next: (updatedActivity: Activity) =>
        this.passBackUpdatedActivity(updatedActivity),
      error: (err: ApiResponseError) =>
        this.logError('Error updating Activity', err),
      complete: () => console.log('Activity updated.'),
    };

    this.updateActivitySubscription = this.activitiesService
      .updateActivity(activity)
      .subscribe(activityObserver);
  }

  private passBackUpdatedActivity(updatedActivity: Activity) {
    this.editActivityChanges.emit(updatedActivity);
    this.cancelEditActivityModal?.nativeElement.click();
  }

  private createActivity(activity: Activity) {
    const activityObserver = {
      next: (createdActivity: Activity) =>
        this.passBackCreatedActivity(createdActivity),
      error: (err: ApiResponseError) =>
        this.logError('Error creating Activity', err),
      complete: () => console.log('Activity created.'),
    };

    this.createActivitySubscription = this.activitiesService
      .createActivity(activity)
      .subscribe(activityObserver);
  }

  private passBackCreatedActivity(createdActivity: Activity) {
    this.createActivityChanges.emit(createdActivity);
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
