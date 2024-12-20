import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { forkJoin, Subject, Subscription } from 'rxjs';

import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { KnightUser } from 'src/app/models/knightUser';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { MemberDues } from 'src/app/models/memberDues';
import { KnightInfo } from 'src/app/models/knightInfo';
import { FormsService } from 'src/app/services/forms.service';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { SearchPartialNameEvent } from 'src/app/models/events/searchPartialNameEvent';
import { CreateKnightModalComponent } from './create-knight-modal/create-knight-modal.component';
import { EditKnightPasswordModalComponent } from './edit-knight-password-modal/edit-knight-password-modal.component';
import { EditKnightMemberDuesModalComponent } from './edit-knight-member-dues-modal/edit-knight-member-dues-modal.component';
import { EditKnightMemberInfoModalComponent } from './edit-knight-member-info-modal/edit-knight-member-info-modal.component';
import { EditKnightActivityInterestsModalComponent } from './edit-knight-activity-interests-modal/edit-knight-activity-interests-modal.component';
import { EditKnightPersonalInfoModalComponent } from './edit-knight-personal-info-modal/edit-knight-personal-info-modal.component';

@Component({
  selector: 'knights',
  templateUrl: './knights.component.html',
  styleUrls: ['./knights.component.scss'],
})
export class KnightsComponent implements OnInit, OnDestroy {
  @ViewChild(CreateKnightModalComponent) createKnightModal: CreateKnightModalComponent | undefined;
  @ViewChild(EditKnightPasswordModalComponent) editKnightPasswordModal: EditKnightPasswordModalComponent | undefined;
  @ViewChild(EditKnightMemberDuesModalComponent) editKnightMemberDuesModal: EditKnightMemberDuesModalComponent | undefined;
  @ViewChild(EditKnightMemberInfoModalComponent) editKnightMemberInfoModal: EditKnightMemberInfoModalComponent | undefined;
  @ViewChild(EditKnightActivityInterestsModalComponent) editKnightActivityInterestsModal: EditKnightActivityInterestsModalComponent | undefined;
  @ViewChild(EditKnightPersonalInfoModalComponent) editKnightPersonalInfoModal: EditKnightPersonalInfoModalComponent | undefined;
  allKnights: Knight[] = [];
  displayedKnights: Knight[] = [];
  displayedKnightsCount: number = 0;
  private knightsSubscription?: Subscription;
  private createKnightSubscription?: Subscription;
  private getFormsSubscription?: Subscription;
  private updateKnightPersonalInfoSubscription?: Subscription;
  knightsLoaded: boolean = false;
  page = 1;
  pageSize = 5;
  maxSize = 10;

  private _search$ = new Subject<void>();

  public knightActivityInterestsForNewKnight: ActivityInterest[] = [];
  public countryFormOptions: CountryFormOption[] = [];
  public activityCategoryFormOptions: GenericFormOption[] = [];
  public knightDegreeFormOptions: GenericFormOption[] = [];
  public knightMemberTypeFormOptions: GenericFormOption[] = [];
  public knightMemberClassFormOptions: GenericFormOption[] = [];
  public memberDuesPaymentStatusFormOptions: GenericFormOption[] = [];
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  public editKnightPasswordModalText: string = '';
  public knightId: string = '';
  public knightFullName: string = '';

  public editKnightMemberInfoModalHeaderText: string = '';
  public editKnightPersonalInfoModalHeaderText: string = '';

  public editKnightMemberDuesModalHeaderText: string = '';

  public editKnightActivityInterestsModalHeaderText: string = '';

  public showUploadKnightsModal: boolean = false;

  constructor(
    private formsService: FormsService,
    private knightsService: KnightsService,
    private knightActivityInterestsService: KnightActivityInterestsService,
  ) {}

  ngOnInit() {
    this.getAllKnights();
  }

  ngOnDestroy() {
    if (this.knightsSubscription) {
      this.knightsSubscription.unsubscribe();
    }

    if (this.createKnightSubscription) {
      this.createKnightSubscription.unsubscribe();
    }

    if (this.getFormsSubscription) {
      this.getFormsSubscription.unsubscribe();
    }

    if (this.updateKnightPersonalInfoSubscription) {
      this.updateKnightPersonalInfoSubscription.unsubscribe();
    }
  }

  private getAllKnights() {
    const formsObserver = {
      next: ([
        knightsResponse,
        activityCategoriesResponse,
        knightDegreeResponse,
        knightMemberTypeResponse,
        knightMemberClassResponse,
        countryResponse,
        memberDuesPaymentStatusResponse,
        knightActivityInterests,
      ]: [
        Knight[],
        GenericFormOption[],
        GenericFormOption[],
        GenericFormOption[],
        GenericFormOption[],
        CountryFormOption[],
        GenericFormOption[],
        ActivityInterest[],
      ]) => {
        this.activityCategoryFormOptions = activityCategoriesResponse;
        this.knightDegreeFormOptions = knightDegreeResponse;
        this.knightMemberTypeFormOptions = knightMemberTypeResponse;
        this.knightMemberClassFormOptions = knightMemberClassResponse;
        this.countryFormOptions = countryResponse;
        this.memberDuesPaymentStatusFormOptions = memberDuesPaymentStatusResponse;
        this.knightActivityInterestsForNewKnight = knightActivityInterests;
        this.applySearchFilter(knightsResponse);
      },
      error: (err: ApiResponseError) => this.logError('Error getting Knight Degree Form Options', err),
      complete: () => console.log('Knight Degree Form Options retrieved.'),
    };

    this.getFormsSubscription = forkJoin([
      this.knightsService.getAllKnights(),
      this.formsService.getActivityCategoryFormOptions(),
      this.formsService.getKnightDegreeFormOptions(),
      this.formsService.getKnightMemberTypeFormOptions(),
      this.formsService.getKnightMemberClassFormOptions(),
      this.formsService.getCountryFormOptions(),
      this.formsService.getMemberDuesPaymentStatusFormOptions(),
      this.knightActivityInterestsService.getAllIKnightActivityInterestsForNewKnight(),
    ]).subscribe(formsObserver);
  }

  private applySearchFilter(knights: Knight[]) {
    this.allKnights = knights;
    this.displayedKnights = knights;
    this.displayedKnightsCount = this.allKnights.length;
    this.knightsLoaded = true;
  }

  searchPartialName(event: SearchPartialNameEvent) {
    const text = (event.target?.value || '').toLowerCase();
    this.page = 1;
    this.displayedKnights = this.allKnights.filter(
      (knight) =>
        (knight.firstName && knight.firstName.toLowerCase().includes(text)) ||
        (knight.lastName && knight.lastName.toLowerCase().includes(text)),
    );
  }

  public openEditKnightPersonalInfoModal(knight: Knight) {
    this.editKnightPersonalInfoModalHeaderText = 'Editing Knight Personal Info';

    this.editKnightPersonalInfoModal?.resetForm(knight);
  }

  public openEditKnightActivityInterestsModal(knight: Knight) {
    this.knightId = knight.id || '';
    this.editKnightActivityInterestsModalHeaderText = `Editing Activity Interests for ${knight.firstName} ${knight.lastName}`;

    this.editKnightActivityInterestsModal?.resetForm(knight.activityInterests);
  }

  public openEditKnightMemberDuesModal(knight: Knight) {
    this.knightId = knight.id || '';
    this.editKnightMemberDuesModalHeaderText = `Editing Member Dues for ${knight.firstName} ${knight.lastName}`;

    this.editKnightMemberDuesModal?.resetForm(knight.memberDues);
  }

  public openEditKnightMemberInfoModal(knight: Knight) {
    this.editKnightMemberInfoModalHeaderText = `Editing Member Info for ${knight.firstName} ${knight.lastName}`;
    this.knightId = knight.id || '';

    this.editKnightMemberInfoModal?.resetForm(knight.knightInfo);
  }

  public openEditKnightPassword(knight: Knight) {
    this.editKnightPasswordModalText = `Editing Knight Password for ${knight.firstName} ${knight.lastName}`;
    this.knightFullName = `${knight.firstName} ${knight.lastName}`;
    this.knightId = knight.id || '';

    this.editKnightPasswordModal?.resetForm(knight.knightUser);
  }

  public updateKnightPersonalInfoInList(knight: Knight) {
    const index = this.allKnights?.findIndex((x) => x.id == knight.id);

    if (this.allKnights && index !== undefined && index >= 0) {
      knight.knightInfo = this.allKnights[index].knightInfo;
      knight.memberDues = this.allKnights[index].memberDues;
      knight.activityInterests = this.allKnights[index].activityInterests;
      knight.knightUser = this.allKnights[index].knightUser;

      this.allKnights[index] = knight;
    }
  }

  public updateKnightActivityInterestsInList(activityInterests: ActivityInterest[]) {
    const index = this.allKnights?.findIndex((x) => x.id == this.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].activityInterests = activityInterests;
    }
  }

  public updateKnightMemberDuesInList(memberDues: MemberDues[]) {
    const index = this.allKnights?.findIndex((x) => x.id == this.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].memberDues = memberDues;
    }
  }

  public updateKnightMemberInfoInList(knightMemberInfo: KnightInfo) {
    const index = this.allKnights?.findIndex((x) => x.id == this.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].knightInfo = knightMemberInfo;
    }
  }

  public updateKnightUserInList(knightUser: KnightUser) {
    const index = this.allKnights?.findIndex((x) => x.id == this.knightId);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].knightUser = knightUser;
    }
  }

  openCreateKnightModal() {
    this.createKnightModal?.resetForm();
  }

  openUploadKnightsModal() {
    this.showUploadKnightsModal = true;
  }

  public addKnightToAllKnights(knight: Knight) {
    this.allKnights?.push(knight);
  }

  public addKnights(knights: Knight[]) {
    knights.forEach((k) => this.allKnights.push(k));
    this.showUploadKnightsModal = false;
  }

  private logError(errorMessage: string, error: ApiResponseError) {
    console.log(errorMessage);
    console.log(error);
  }
}
