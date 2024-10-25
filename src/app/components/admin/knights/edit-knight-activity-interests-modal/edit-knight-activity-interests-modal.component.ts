import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { ActivityCategoryFormOption } from 'src/app/models/inputOptions/activityCategoryFormOption';
import { UpdateKnightActivityInterestsRequest } from 'src/app/models/requests/updateKnightActivityInterestsRequest';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';

@Component({
  selector: 'edit-knight-activity-interests-modal',
  templateUrl: './edit-knight-activity-interests-modal.component.html',
  styleUrls: ['./edit-knight-activity-interests-modal.component.scss']
})
export class EditKnightActivityInterestsModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() activityInterests: ActivityInterest[] = [];
  @Input() knightId: string = '';
  @Input() activityCategoryFormOptions: ActivityCategoryFormOption[] = [];
  @Output() editKnightMemberDuesChanges = new EventEmitter<ActivityInterest[]>();
  @ViewChild('closeModal', {static: false}) closeModal: ElementRef | undefined;
  
  public editKnightActivityInterestsForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightActivityInterestsSubscription?: Subscription;

  constructor(
    private knightActivityInterestsService: KnightActivityInterestsService
  ) {
    this.editKnightActivityInterestsForm = new UntypedFormGroup({
      communityActivityInterests: new UntypedFormArray([]),
      faithActivityInterests: new UntypedFormArray([]),
      familyActivityInterests: new UntypedFormArray([]),
      lifeActivityInterests: new UntypedFormArray([]),
      miscellaneousActivityInterests: new UntypedFormArray([])
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.updateKnightActivityInterestsSubscription) {
      this.updateKnightActivityInterestsSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    this.editKnightActivityInterestsForm = new UntypedFormGroup({
      communityActivityInterests: new UntypedFormArray([]),
      faithActivityInterests: new UntypedFormArray([]),
      familyActivityInterests: new UntypedFormArray([]),
      lifeActivityInterests: new UntypedFormArray([]),
      miscellaneousActivityInterests: new UntypedFormArray([])
    });

    this.fillOutActivityInterestForm();
  }

  private fillOutActivityInterestForm() {
    if (this.activityInterests) {
      this.activityCategoryFormOptions.forEach(activityCategoryFormOptions => {
        let activityInterestsFormArray = this.getActivityInterestsFormArray(`${activityCategoryFormOptions.value.toLowerCase()}ActivityInterests`);
        let filteredActivities = this.activityInterests?.filter(activityInterest => {
          return activityInterest.activityCategory === activityCategoryFormOptions.value;
        });
        filteredActivities?.forEach((activityInterest: ActivityInterest) =>{
          const activityInterestFormGroup = new UntypedFormGroup({
            activityId: new UntypedFormControl(activityInterest.activityId),
            activityName: new UntypedFormControl(activityInterest.activityName),
            activityCategory: new UntypedFormControl(activityInterest.activityCategory),
            interested: new UntypedFormControl(activityInterest.interested),
          });
          activityInterestsFormArray.push(activityInterestFormGroup);
        });
      });
    }
  }

  get activityInterestsFormArray(): UntypedFormArray {
    return this.editKnightActivityInterestsForm.controls["activityInterests"] as UntypedFormArray;
  }

  public getActivityCategoryFormGroupName(activityCategoryValue: string) {
    return activityCategoryValue.toLowerCase();
  }

  public getActivityInterestsFormArray(activityCategory: string): UntypedFormArray {
    let activityInterestsFormArray = this.editKnightActivityInterestsForm.controls[activityCategory] as UntypedFormArray;

    return activityInterestsFormArray;
  }

  public getFormArrayName(activityCategoryInputOption: ActivityCategoryFormOption) {
    return `${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`;
  }

  public getActivityName(activityInterest: AbstractControl): string {
    let rawValue = activityInterest.getRawValue();
    let activityName = rawValue.activityName;

    return activityName as string;
  }

  public onSubmitEditKnightActivityInterests() {
    let request = this.mapFormToActivityInterests();
    let knightActivityInterestsObserver = {
      next: (response: ActivityInterest[]) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight Activity Interests", err),
      complete: () => console.log('Activity Interests updated.')
    };

    this.updateKnightActivityInterestsSubscription = this.knightActivityInterestsService.updateKnightActivityInterests(request).subscribe(knightActivityInterestsObserver);
  }

  private mapFormToActivityInterests(): UpdateKnightActivityInterestsRequest {
    let rawForm = this.editKnightActivityInterestsForm.getRawValue();
    console.log('mapFormToActivityInterests');
    console.log(rawForm);

    let request: UpdateKnightActivityInterestsRequest = {
      knightId: this.knightId,
      activityInterests: []
    };

    this.activityCategoryFormOptions.forEach(activityCategoryFormOption => {
      let activityInterests = rawForm[`${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`];

      activityInterests.forEach((ai: any) => {
        console.log(ai);
        request.activityInterests.push({
          activityId: ai.activityId,
          activityName: ai.activityName,
          activityCategory: ai.activityCategory,
          interested: ai.interested
        });
      });
    });

    console.log('mapped request');
    console.log(request);

    return request;
  }

  private passBackResponse(response: ActivityInterest[]) {
    this.editKnightMemberDuesChanges.emit(response);
    this.updateKnightActivityInterestsSubscription?.unsubscribe();
    this.closeModal?.nativeElement.click();
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

