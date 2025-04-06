import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditActivityInterestFormGroup } from 'src/app/forms/editActivityInterestFormGroup';
import { EditActivityInterestsFormGroup } from 'src/app/forms/editActivityInterestsFormGroup';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { UpdateKnightActivityInterestsRequest } from 'src/app/models/requests/updateKnightActivityInterestsRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';

@Component({
    selector: 'edit-knight-activity-interests-modal',
    templateUrl: './edit-knight-activity-interests-modal.component.html',
    styleUrls: ['./edit-knight-activity-interests-modal.component.scss'],
    standalone: false
})
export class EditKnightActivityInterestsModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knightId: string = '';
  @Input() activityCategoryFormOptions: GenericFormOption[] = [];
  @Output() editKnightActivityInterestsChanges = new EventEmitter<ActivityInterest[]>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public editKnightActivityInterestsForm: FormGroup<EditActivityInterestsFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightActivityInterestsSubscription?: Subscription;
  private activityInterests: ActivityInterest[] = [];

  constructor(private knightActivityInterestsService: KnightActivityInterestsService) {
    this.editKnightActivityInterestsForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.updateKnightActivityInterestsSubscription) {
      this.updateKnightActivityInterestsSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
  }

  public resetForm(knightActivityInterests: ActivityInterest[]): void {
    this.activityInterests = knightActivityInterests;
    this.editKnightActivityInterestsForm = this.initForm();
    this.errorSaving = false;
    this.errorMessages = [];
    this.patchForm(knightActivityInterests);
  }

  private initForm(): FormGroup<EditActivityInterestsFormGroup> {
    return new FormGroup<EditActivityInterestsFormGroup>({
      activityInterests: new FormArray<FormGroup<EditActivityInterestFormGroup>>([]),
    });
  }

  private patchForm(knightActivityInterests: ActivityInterest[]): void {
    console.log('patchForm interests');

    knightActivityInterests.forEach((interest: ActivityInterest) => {
      const activityInterestFormGroup = new FormGroup<EditActivityInterestFormGroup>({
        activityId: new FormControl<string>(interest.activityId, { nonNullable: true}),
        activityName: new FormControl<string>(interest.activityName, { nonNullable: true}),
        activityCategory: new FormControl<string>(interest.activityCategory, { nonNullable: true}),
        interested: new FormControl<boolean>(interest.interested, { nonNullable: true}),
      });
      this.editKnightActivityInterestsForm.controls.activityInterests.controls.push(activityInterestFormGroup);
    });
  }

  public getFormArrayName(activityCategoryInputOption: GenericFormOption) {
    console.log('getFormArrayName');
    return `${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`;
  }

  public getActivityName(activityInterest: AbstractControl): string {
    const rawValue = activityInterest.getRawValue();
    const activityName = rawValue.activityName;

    return activityName as string;
  }

  public onSubmitEditKnightActivityInterests() {
    const request = this.mapFormToActivityInterests();
    const knightActivityInterestsObserver = {
      next: (response: ActivityInterest[]) => this.passBackResponse(response),
      error: (err: ApiResponseError) => this.logError('Error Updating Knight Activity Interests', err),
      complete: () => console.log('Activity Interests updated.'),
    };

    this.updateKnightActivityInterestsSubscription = this.knightActivityInterestsService
      .updateKnightActivityInterests(request)
      .subscribe(knightActivityInterestsObserver);
  }

  private mapFormToActivityInterests(): UpdateKnightActivityInterestsRequest {
    const request: UpdateKnightActivityInterestsRequest = {
      knightId: this.knightId,
      activityInterests: [],
    };

    this.editKnightActivityInterestsForm.controls.activityInterests.controls.forEach((formGroup) => {
      request.activityInterests.push({
        activityId: formGroup.controls.activityId.value,
        interested: formGroup.controls.interested.value
      } as ActivityInterest);
    });

    return request;
  }

  private passBackResponse(response: ActivityInterest[]) {
    response.forEach((kai) => {
      const indexOfActivity = this.activityInterests.findIndex(ai => ai.activityId === kai.activityId);

      if (indexOfActivity > -1) {
        this.activityInterests[indexOfActivity].interested = kai.interested;
      }
    });
    this.editKnightActivityInterestsChanges.emit(this.activityInterests);
    this.updateKnightActivityInterestsSubscription?.unsubscribe();
    this.closeModal?.nativeElement.click();
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach(error => {
        this.errorMessages.push(error);
      })
    }

    this.errorSaving = true;
  }
}
