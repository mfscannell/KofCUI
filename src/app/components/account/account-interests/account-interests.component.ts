import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { ActivityCategory } from 'src/app/models/activityCategory';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { StreetAddress } from 'src/app/models/streetAddress';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { Knight } from 'src/app/models/knight';
import { KnightInfo } from 'src/app/models/knightInfo';
import { ActivityCategoriesService } from 'src/app/services/activityCategories.service';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { UpdateKnightActivityInterestsRequest } from 'src/app/models/requests/updateKnightActivityInterestsRequest';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'kofc-account-interests',
  templateUrl: './account-interests.component.html',
  styleUrls: ['./account-interests.component.css']
})
export class AccountInterestsComponent implements OnInit, OnDestroy {
  editKnightActivityInterestsForm: FormGroup;
  knightId?: number;
  knight?: Knight;
  activityCategories: ActivityCategory[] = [];
  allActivities: ActivityInterest[] = [];
  getKnightSubscription?: Subscription;
  getActivityCategoriesSubscription?: Subscription;
  updateKnightActivityInterestSubscription?: Subscription;
  errorMessages: string[] = [];
  errorSaving: boolean = false;

  constructor(
    private knightsService: KnightsService,
    private activityCategoriesService: ActivityCategoriesService,
    private router: Router,
    private accountsService: AccountsService
  ) {
    this.editKnightActivityInterestsForm = new FormGroup({});
  }

  ngOnInit() {
    this.knightId = this.accountsService.getKnightId();
    this.getKnight();
    this.getActivityCategories();
  }

  ngOnDestroy() {
    if (this.getKnightSubscription) {
      this.getKnightSubscription.unsubscribe;
    }

    if (this.getActivityCategoriesSubscription) {
      this.getActivityCategoriesSubscription.unsubscribe();
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

  private getActivityCategories() {
    let activityCategoriesObserver = {
      next: (activityCategories: ActivityCategory[]) => this.activityCategories = activityCategories,
      error: (err: any) => this.logError('Error getting activity categories', err),
      complete: () => console.log('Activity categories loaded.')
    };

    this.getActivityCategoriesSubscription = this.activityCategoriesService.getAllActivityCategories().subscribe(activityCategoriesObserver);
  }

  filterActivitiesByCategoryId(activityCategoryId: number) {
    return this.allActivities.filter(x => x.activityCategoryId == activityCategoryId);
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
