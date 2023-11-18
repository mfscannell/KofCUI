import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { UpdateKnightActivityInterestsRequest } from 'src/app/models/requests/updateKnightActivityInterestsRequest';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';

@Component({
  selector: 'kofc-edit-account-interests-modal',
  templateUrl: './edit-account-interests-modal.component.html',
  styleUrls: ['./edit-account-interests-modal.component.scss']
})
export class EditAccountInterestsModalComponent implements OnInit, OnDestroy {
  @Input() knightId?: number;
  @Input() allActivities: ActivityInterest[] = [];
  public editKnightActivityInterestsForm: UntypedFormGroup;
  public activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  public errorMessages: string[] = [];
  public errorSaving: boolean = false;
  private updateKnightActivityInterestSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private knightActivityInterestsService: KnightActivityInterestsService
  ) {
    this.editKnightActivityInterestsForm = new UntypedFormGroup({});
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.updateKnightActivityInterestSubscription) {
      this.updateKnightActivityInterestSubscription.unsubscribe();
    }
  }

  filterActivitiesByCategory(activityCategoryValue: string) {
    return this.allActivities.filter(x => x.activityCategory === activityCategoryValue);
  }

  toggleInterestCheckbox(interestChangeEvent: any, activity: ActivityInterest) {
    activity.interested = interestChangeEvent.target.checked;
  }

  onSubmitEditActivityInterests() {
    this.updateKnightActivityInterests(this.allActivities);
  }

  private updateKnightActivityInterests(knightActivityInterests: ActivityInterest[]) {
    if (this.knightId) {
      let knightObserver = {
        next: (response: ActivityInterest[]) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Updating Knight Activity Interests.", err),
        complete: () => console.log('Knight Activity Interests updated.')
      };
  
      let request = {
        knightId: this.knightId,
        activityInterests: knightActivityInterests};
  
      this.updateKnightActivityInterestSubscription = this.knightActivityInterestsService.updateKnightActivityInterests(request).subscribe(knightObserver);
    }
  }

  private passBackResponse(activityInterests: ActivityInterest[]) {
    this.activeModal.close(activityInterests);
  }

  logError(message: string, err: any) {
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
