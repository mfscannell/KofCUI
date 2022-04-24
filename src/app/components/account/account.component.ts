import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'kofc-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  active = 'accountHome';
  knightId?: number;
  knight?: Knight;
  activityCategories: ActivityCategory[] = [];
  getKnightSubscription?: Subscription;
  getActivityCategoriesSubscription?: Subscription;
  updateKnightSubscription?: Subscription;
  updateKnightActivityInterestSubscription?: Subscription;
  errorMessages: string[] = [];
  public knightDegrees = Object.values(KnightDegreeEnums);
  public knightMemberTypeEnums = Object.values(KnightMemberTypeEnums);
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  showErrorSavingInfo: boolean = false;
  showSuccessSavingInfo: boolean = false;
  showErrorSavingInterests: boolean = false;
  showSuccessSavingInterests: boolean = false;
  disableDegreeSelect() {
    return true;
  }

  constructor(
    private knightsService: KnightsService,
    private activityCategoriesService: ActivityCategoriesService,
    private accountsService: AccountsService) {
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
  }

  filterActivitiesByCategoryId(activityCategoryId: number) {
    return this.knight?.activityInterests.filter(x => x.activityCategoryId == activityCategoryId);
  }

  filterActivitiesInterested() {
    return this.knight?.activityInterests.filter(x => x.interested);
  }

  formatDate(date: string | undefined) {
    return DateTimeFormatter.ToDisplayedDate(date);
  }

  private getKnight() {
    if (this.knightId) {
      let knightObserver = {
        next: (getKnightResponse: Knight) => this.knight = getKnightResponse,
        error: (err: any) => this.logError('Error getting knight.', err),
        complete: () => console.log('Knight loaded.')
      };
      
      this.getKnightSubscription = this.knightsService.getKnight(this.knightId).subscribe(knightObserver);
    }
  }

  private getActivityCategories() {
    let activityCategoriesObserver = {
      next: (activityCategories: ActivityCategory[]) => this.activityCategories = activityCategories,
      error: (err: any) => this.logError('Error getting activity categories', err),
      complete: () => console.log('Activity categories loaded.')
    };

    this.getActivityCategoriesSubscription = this.activityCategoriesService.getAllActivityCategories().subscribe(activityCategoriesObserver);
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
  }
}
