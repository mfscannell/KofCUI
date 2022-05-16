import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { UpdateKnightActivityInterestsRequest } from 'src/app/models/requests/updateKnightActivityInterestsRequest';
import { AccountsService } from 'src/app/services/accounts.service';
import { ActivityCategoryEnums } from 'src/app/enums/activityCategoryEnums';

@Component({
  selector: 'kofc-account-interests',
  templateUrl: './account-interests.component.html',
  styleUrls: ['./account-interests.component.css']
})
export class AccountInterestsComponent implements OnInit, OnDestroy {
  editKnightActivityInterestsForm: FormGroup;
  knightId?: number;
  knight?: Knight;
  activityCategories: ActivityCategoryEnums[] = Object.values(ActivityCategoryEnums);
  allActivities: ActivityInterest[] = [];
  getKnightSubscription?: Subscription;
  getActivityCategoriesSubscription?: Subscription;
  updateKnightActivityInterestSubscription?: Subscription;
  errorMessages: string[] = [];
  errorSaving: boolean = false;

  constructor(
    private knightsService: KnightsService,
    private router: Router,
    private accountsService: AccountsService
  ) {
    this.editKnightActivityInterestsForm = new FormGroup({});
  }

  ngOnInit() {
    this.knightId = this.accountsService.getKnightId();
    this.getKnight();
  }

  ngOnDestroy() {
    if (this.getKnightSubscription) {
      this.getKnightSubscription.unsubscribe;
    }

    if (this.updateKnightActivityInterestSubscription) {
      this.updateKnightActivityInterestSubscription.unsubscribe();
    }
  }

  private getKnight() {
    if (this.knightId) {
      let knightObserver = {
        next: (getKnightResponse: Knight) => this.patchKnightForm(getKnightResponse),
        error: (err: any) => this.logError('Error getting knight.', err),
        complete: () => console.log('Knight loaded.')
      };

      this.getKnightSubscription = this.knightsService.getKnight(this.knightId).subscribe(knightObserver);
    }
  }

  private patchKnightForm(knight: Knight) {
     this.allActivities = knight.activityInterests;
  }

  filterActivitiesByCategory(activityCategory: ActivityCategoryEnums) {
    return this.allActivities.filter(x => x.activityCategory === activityCategory);
  }

  toggleInterestCheckbox(interestChangeEvent: any, activity: ActivityInterest) {
    activity.interested = interestChangeEvent.target.checked;
  }

  onSubmitEditActivityInterests() {
    //let updatedKnight = this.mapFormToKnight();
    this.updateKnightActivityInterests(this.allActivities);
  }

  private updateKnightActivityInterests(knightActivityInterests: ActivityInterest[]) {
    if (this.knightId) {
      let knightObserver = {
        next: (response: ActivityInterest[]) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Updating Knight Activity Interests.", err),
        complete: () => console.log('Knight Activity Interests updated.')
      };
  
      let request = new UpdateKnightActivityInterestsRequest({
        knightId: this.knightId,
        activityInterests: knightActivityInterests});
  
      this.updateKnightActivityInterestSubscription = this.knightsService.updateKnightActivityInterest(request).subscribe(knightObserver);
    }
  }

  private passBackResponse(activityInterests: ActivityInterest[]) {
    this.router.navigate(['/account']);
  }

  cancelEditKnightInterests() {
    this.router.navigate(['/account']);
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
