import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { UpdateKnightActivityInterestsRequest } from 'src/app/models/requests/updateKnightActivityInterestsRequest';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { KnightsService } from 'src/app/services/knights.service';

@Component({
  selector: 'app-edit-knight-activity-interests-modal',
  templateUrl: './edit-knight-activity-interests-modal.component.html',
  styleUrls: ['./edit-knight-activity-interests-modal.component.scss']
})
export class EditKnightActivityInterestsModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() activityInterests?: ActivityInterest[] = [];
  @Input() knightId: number = 0;
  public activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  public editKnightActivityInterestsForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightActivityInterestsSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
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
    if (this.activityInterests) {
      let communityActivities = this.activityInterests.filter(activityInterest => {
        return activityInterest.activityCategory === 'Community';
      });
      let faithActivities = this.activityInterests.filter(activityInterest => {
        return activityInterest.activityCategory === 'Faith';
      });
      let familyActivities = this.activityInterests.filter(activityInterest => {
        return activityInterest.activityCategory === 'Family';
      });
      let lifeActivities = this.activityInterests.filter(activityInterest => {
        return activityInterest.activityCategory === 'Life';
      });
      let miscellaneousActivities = this.activityInterests.filter(activityInterest => {
        return activityInterest.activityCategory === 'Miscellaneous';
      });

      this.activityCategoryInputOptions.forEach(activityCategoryInputOption => {
        let activityInterestsFormArray = this.getActivityInterestsFormArray(`${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`);
        let filteredActivities = this.activityInterests?.filter(activityInterest => {
          return activityInterest.activityCategory === activityCategoryInputOption.value;
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

      // this.activityInterests.forEach((activityInterest: ActivityInterest) => {
      //   const activityInterestFormGroup = new UntypedFormGroup({
      //     activityId: new UntypedFormControl(activityInterest.activityId),
      //     activityName: new UntypedFormControl(activityInterest.activityName),
      //     activityCategory: new UntypedFormControl(activityInterest.activityCategory),
      //     interested: new UntypedFormControl(activityInterest.interested),
      //   });

      //   this.activityInterestsFormArray.push(activityInterestFormGroup);
      //  });
    }
  }

  ngOnDestroy() {
    if (this.updateKnightActivityInterestsSubscription) {
      this.updateKnightActivityInterestsSubscription.unsubscribe();
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

  public getFormArrayName(activityCategoryInputOption: ActivityCategoryInputOption) {
    return `${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`;
  }

  public filterActivityInterestsByCategory(activityCategory: string): AbstractControl[] {
    let something = this.activityInterestsFormArray.controls.filter(control => {
      let controlRawValue = control.getRawValue();

      return (controlRawValue.activityCategory as string) === activityCategory;
    });

    return something;
  }

  public getActivityName(activityInterest: AbstractControl): string {
    let rawValue = activityInterest.getRawValue();
    let activityName = rawValue.activityName;
    //console.log(`getActivityName: ${activityName}`);
    //console.log(activityInterest);

    // let filteredActivities = this.activityInterests?.filter(activityInterest => activityName === activityName);

    // let returnedActivityName = '';

    // if (filteredActivities && filteredActivities.length > 0) {
    //   returnedActivityName = filteredActivities[0].activityName;
    // }

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
    // let rawForm = this.editKnightActivityInterestsForm.getRawValue();
    // console.log('mapFormToActivityInterests');
    // console.log(rawForm);
    // let mappedActivityInterests: ActivityInterest[] = rawForm?.activityInterests?.map(function(ai: any) {
    //   console.log(`mapped ActivityInterest: ${ai.activityName}: ${ai.interested}`)
    //   return new ActivityInterest({
    //     activityId: ai.activityId,
    //     activityName: ai.activityName,
    //     activityCategory: ai.activityCategory,
    //     interested: ai.interested
    //   })
    // });
    // let request = {
    //   knightId: this.knightId,
    //   activityInterests: mappedActivityInterests
    // };

    // return request;

    // this.activityCategoryInputOptions.forEach(activityCategoryInputOption => {
    //   let activityInterestsFormArray = this.getActivityInterestsFormArray(activityCategoryInputOption.value);
    //   console.log(`Getting activities for : ${activityCategoryInputOption.value}`);
    //   let filteredActivities = this.activityInterests?.filter(activityInterest => {
    //     return activityInterest.activityCategory === activityCategoryInputOption.value;
    //   });
    //   console.log(filteredActivities);
    //   filteredActivities?.forEach((activityInterest: ActivityInterest) =>{
    //     const activityInterestFormGroup = new UntypedFormGroup({
    //       activityId: new UntypedFormControl(activityInterest.activityId),
    //       activityName: new UntypedFormControl(activityInterest.activityName),
    //       activityCategory: new UntypedFormControl(activityInterest.activityCategory),
    //       interested: new UntypedFormControl(activityInterest.interested),
    //     });
    //     activityInterestsFormArray.push(activityInterestFormGroup);
    //   });
    // });



    let rawForm = this.editKnightActivityInterestsForm.getRawValue();
    console.log('mapFormToActivityInterests');
    console.log(rawForm);

    let request: UpdateKnightActivityInterestsRequest = {
      knightId: this.knightId,
      activityInterests: []
    };

    this.activityCategoryInputOptions.forEach(activityCategoryInputOption => {
      let activityInterests = rawForm[`${activityCategoryInputOption.value.toLowerCase()}ActivityInterests`];

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
    this.activeModal.close(response);
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

