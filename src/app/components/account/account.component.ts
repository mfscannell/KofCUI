import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { AccountsService } from 'src/app/services/accounts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditAccountPersonalInfoModalComponent } from './edit-account-personalInfo-modal/edit-account-personalInfo-modal.component';
import { EditAccountInterestsModalComponent } from './edit-account-interests-modal/edit-account-interests-modal.component';
import { EditAccountSecurityModalComponent } from './edit-account-security-modal/edit-account-security-modal.component';
import { ChangePasswordResponse } from 'src/app/models/responses/changePasswordResponse';
import { ActivityCategoryInputOption } from 'src/app/models/inputOptions/activityCategoryInputOption';
import { KnightDegreeInputOption } from 'src/app/models/inputOptions/knightDegreeInputOption';
import { KnightMemberTypeInputOption } from 'src/app/models/inputOptions/knightMemberTypeInputOption';

@Component({
  selector: 'kofc-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  active = 'accountHome';
  knightId?: number;
  knight?: Knight;
  activityCategoryInputOptions: ActivityCategoryInputOption[] = ActivityCategoryInputOption.options;
  getKnightSubscription?: Subscription;
  updateKnightSubscription?: Subscription;
  updateKnightActivityInterestSubscription?: Subscription;
  errorMessages: string[] = [];
  public knightDegreeInputOptions: KnightDegreeInputOption[] = KnightDegreeInputOption.options;
  public knightMemberTypeInputOptions: KnightMemberTypeInputOption[] = KnightMemberTypeInputOption.options;
  showErrorSavingInfo: boolean = false;
  showSuccessSavingInfo: boolean = false;
  showErrorSavingInterests: boolean = false;
  showSuccessSavingInterests: boolean = false;
  disableDegreeSelect() {
    return true;
  }

  constructor(
    private modalService: NgbModal,
    private knightsService: KnightsService,
    private accountsService: AccountsService) {
  }

  ngOnInit() {
    this.knightId = this.accountsService.getKnightId();
    this.getKnight();
  }

  ngOnDestroy() {
    if (this.getKnightSubscription) {
      this.getKnightSubscription.unsubscribe;
    }
  }

  filterActivitiesByCategory(activityCategoryValue: string) {
    return this.knight?.activityInterests.filter(x => x.activityCategory === activityCategoryValue);
  }

  filterActivitiesInterested() {
    return this.knight?.activityInterests.filter(x => x.interested);
  }

  filterActivitiesInterestedInCategory(activityCategoryValue: string) {
    return this.knight?.activityInterests.filter(x => x.interested && x.activityCategory === activityCategoryValue);
  }

  formatDate(date: string | undefined) {
    return DateTimeFormatter.ToDisplayedDate(date);
  }

  openEditAccountPersonalInfoModal() {
    const modalRef = this.modalService.open(EditAccountPersonalInfoModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knight = this.knight;
    modalRef.result.then((result: Knight) => {
      if (result) {
        if (this.knight) {
          result.activityInterests = this.knight?.activityInterests;
          this.knight = result;
        }
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Account Personal Info Modal.');
        console.log(error);
      }
    });
  }

  openEditAccountActivityInterestsModal() {
    const modalRef = this.modalService.open(EditAccountInterestsModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knightId = this.knight?.knightId;
    modalRef.componentInstance.allActivities = this.knight?.activityInterests;
    modalRef.result.then((result: ActivityInterest[]) => {
      if (result) {
        if (this.knight) {
          this.knight.activityInterests = result;
        }
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Account Activity Interests Modal.');
        console.log(error);
      }
    });
  }

  openEditAccountSecurityModal() {
    const modalRef = this.modalService.open(EditAccountSecurityModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knightId = this.knight?.knightId;
    modalRef.result.then((result: ChangePasswordResponse) => {
      if (result) {
        
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Account Security Modal.');
        console.log(error);
      }
    });
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
