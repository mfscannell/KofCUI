import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { forkJoin, Subscription } from 'rxjs';

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
import { CreateKnightModalComponent } from './create-knight-modal/create-knight-modal.component';
import { EditKnightPasswordModalComponent } from './edit-knight-password-modal/edit-knight-password-modal.component';
import { EditKnightMemberDuesModalComponent } from './edit-knight-member-dues-modal/edit-knight-member-dues-modal.component';
import { EditKnightMemberInfoModalComponent } from './edit-knight-member-info-modal/edit-knight-member-info-modal.component';
import { EditKnightActivityInterestsModalComponent } from './edit-knight-activity-interests-modal/edit-knight-activity-interests-modal.component';
import { EditKnightPersonalInfoModalComponent } from './edit-knight-personal-info-modal/edit-knight-personal-info-modal.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SearchKnightsFormGroup } from 'src/app/forms/searchKnightsFormGroup';
import { SearchDegreeFormGroup } from 'src/app/forms/searchDegreesFormGroup';
import { KnightDegree } from 'src/app/types/knight-degree.type';
import { PaginationResponse } from 'src/app/models/responses/paginationResponse';
import { FilterKnightRequest } from 'src/app/models/requests/filterKnightRequest';
import { MemberDuesAmountsService } from 'src/app/services/memberDuesAmounts.service';
import { MemberDuesAmounts } from 'src/app/models/memberDuesAmounts';

@Component({
    selector: 'knights',
    templateUrl: './knights.component.html',
    styleUrls: ['./knights.component.scss'],
    standalone: false
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
  private getKnightSubscription?: Subscription;
  private knightsSubscription?: Subscription;
  private createKnightSubscription?: Subscription;
  private getFormsSubscription?: Subscription;
  private getKnightsSubscription?: Subscription;
  private updateKnightPersonalInfoSubscription?: Subscription;
  public searchKnightsForm: FormGroup<SearchKnightsFormGroup>;
  public pageSizes: number[] = [2, 5];
  public pages: number[] = [1];
  public totalCount: number = 0;
  public disableFirstButton: boolean = true;
  public disableLastButton: boolean = true;
  public disablePreviousButton: boolean = true;
  public disableNextButton: boolean = true;

  public knightActivityInterestsForNewKnight: ActivityInterest[] = [];
  public countryFormOptions: CountryFormOption[] = [];
  public activityCategoryFormOptions: GenericFormOption[] = [];
  public knightDegreeFormOptions: GenericFormOption[] = [];
  public knightMemberTypeFormOptions: GenericFormOption[] = [];
  public knightMemberClassFormOptions: GenericFormOption[] = [];
  public memberDuesPaymentStatusFormOptions: GenericFormOption[] = [];
  public memberDuesAmounts: MemberDuesAmounts[] = [];
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
    private memberDuesAmountsService: MemberDuesAmountsService,
    private knightActivityInterestsService: KnightActivityInterestsService,
  ) {
    this.searchKnightsForm = this.initSearchKnightsForm();
  }

  ngOnInit() {
    this.getFormOptions();
    this.searchKnightsForm.controls.page.patchValue(this.pages[0]);
    this.getKnights();
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

    if (this.getKnightsSubscription) {
      this.getKnightsSubscription.unsubscribe();
    }

    if (this.getKnightSubscription) {
      this.getKnightSubscription.unsubscribe();
    }

    if (this.updateKnightPersonalInfoSubscription) {
      this.updateKnightPersonalInfoSubscription.unsubscribe();
    }
  }

  public onSubmitSearch() {
    this.searchKnightsForm.controls.page.patchValue(this.pages[0]);
    this.getKnights();
  }

  private initSearchKnightsForm() : FormGroup<SearchKnightsFormGroup> {
    return new FormGroup<SearchKnightsFormGroup>({
      nameSearch: new FormControl<string>('', { nonNullable: true, validators: [] }),
      page: new FormControl<number>(this.pages[0], { nonNullable: true, validators: [] }),
      pageSize: new FormControl<number>(this.pageSizes[0], { nonNullable: true, validators: [] }),
      searchDegrees: new FormArray<FormGroup<SearchDegreeFormGroup>>([
        new FormGroup<SearchDegreeFormGroup>({
          degree: new FormControl<KnightDegree>('First', { nonNullable: true, validators: [] }),
          selected: new FormControl<boolean>(true, { nonNullable: true, validators: [] })
        }),
        new FormGroup<SearchDegreeFormGroup>({
          degree: new FormControl<KnightDegree>('Second', { nonNullable: true, validators: [] }),
          selected: new FormControl<boolean>(true, { nonNullable: true, validators: [] })
        }),
        new FormGroup<SearchDegreeFormGroup>({
          degree: new FormControl<KnightDegree>('Third', {nonNullable: true, validators: [] }),
          selected: new FormControl<boolean>(true, { nonNullable: true, validators: [] })
        }),
        new FormGroup<SearchDegreeFormGroup>({
          degree: new FormControl<KnightDegree>('Fourth', {nonNullable: true, validators: [] }),
          selected: new FormControl<boolean>(true, { nonNullable: true, validators: [] })
        })
      ])
    });
  }

  private getFormOptions() {
    const formsObserver = {
      next: ([
        activityCategoriesResponse,
        knightDegreeResponse,
        knightMemberTypeResponse,
        knightMemberClassResponse,
        countryResponse,
        memberDuesPaymentStatusResponse,
        knightActivityInterests,
        memberDuesAmounts,
      ]: [
        GenericFormOption[],
        GenericFormOption[],
        GenericFormOption[],
        GenericFormOption[],
        CountryFormOption[],
        GenericFormOption[],
        ActivityInterest[],
        MemberDuesAmounts[],
      ]) => {
        this.activityCategoryFormOptions = activityCategoriesResponse;
        this.knightDegreeFormOptions = knightDegreeResponse;
        this.knightMemberTypeFormOptions = knightMemberTypeResponse;
        this.knightMemberClassFormOptions = knightMemberClassResponse;
        this.countryFormOptions = countryResponse;
        this.memberDuesPaymentStatusFormOptions = memberDuesPaymentStatusResponse;
        this.knightActivityInterestsForNewKnight = knightActivityInterests;
        this.memberDuesAmounts = memberDuesAmounts;
      },
      error: (err: ApiResponseError) => this.logError('Error getting Knight Degree Form Options', err),
      complete: () => console.log('Knight Degree Form Options retrieved.'),
    };

    this.getFormsSubscription = forkJoin([
      this.formsService.getActivityCategoryFormOptions(),
      this.formsService.getKnightDegreeFormOptions(),
      this.formsService.getKnightMemberTypeFormOptions(),
      this.formsService.getKnightMemberClassFormOptions(),
      this.formsService.getCountryFormOptions(),
      this.formsService.getMemberDuesPaymentStatusFormOptions(),
      this.knightActivityInterestsService.getAllIKnightActivityInterestsForNewKnight(),
      this.memberDuesAmountsService.getMemberDuesAmounts()
    ]).subscribe(formsObserver);
  }

  public changePageSize() {
    this.searchKnightsForm.controls.page.patchValue(1);
    this.getKnights();
  }

  public changePage() {
    this.getKnights();
  }

  public goToFirstPage() {
    this.searchKnightsForm.controls.page.patchValue(1);
    this.getKnights();
  }

  public goToPreviousPage() {
    const currentPage = this.searchKnightsForm.controls.page.value;
    let previousPage = currentPage - 1;

    if (previousPage < this.pages[0]) {
      previousPage = this.pages[0];
    }

    this.searchKnightsForm.controls.page.patchValue(previousPage);
    this.getKnights();
  }

  public goToNextPage() {
    const currentPage = this.searchKnightsForm.controls.page.value;
    let nextPage = currentPage + 1;

    if (nextPage > this.pages[this.pages.length - 1]) {
      nextPage = this.pages[this.pages.length - 1];
    }

    this.searchKnightsForm.controls.page.patchValue(nextPage);
    this.getKnights();
  }

  public goToLastPage() {
    this.searchKnightsForm.controls.page.patchValue(this.pages[this.pages.length - 1]);
    this.getKnights();
  }

  private getKnights() {
    const filterSearch = this.mapForm();
    const getKnightsObserver = {
      next: (knightsResponse: PaginationResponse<Knight[]>) => this.handleGetKnightsResponse(knightsResponse, filterSearch),
      error: (err: ApiResponseError) => this.logError('Error getting Knight Degree Form Options', err),
      complete: () => console.log('Knight Degree Form Options retrieved.'),
    };

    this.knightsService.getAllKnights(filterSearch).subscribe(getKnightsObserver);
  }

  private handleGetKnightsResponse(knightsResponse: PaginationResponse<Knight[]>, filterSearch: FilterKnightRequest) {
    this.allKnights = knightsResponse.value;
    this.totalCount = knightsResponse.count;
    const numPages = Math.ceil(knightsResponse.count / filterSearch.take);
    this.pages = new Array(numPages).fill(null).map((_, i) => i + 1);
    const page = (filterSearch.skip || 0) / filterSearch.take + 1;
    this.searchKnightsForm.controls.page.patchValue(page);
    this.checkPaginationButtons();
  }

  private checkPaginationButtons() {
    this.disableFirstButton = this.searchKnightsForm.controls.page.value === 1;
    this.disablePreviousButton = this.searchKnightsForm.controls.page.value === 1;
    this.disableNextButton = this.searchKnightsForm.controls.page.value === this.pages[this.pages.length - 1];
    this.disableLastButton = this.searchKnightsForm.controls.page.value === this.pages[this.pages.length - 1];
  }

  private mapForm(): FilterKnightRequest {
    const rawForm = this.searchKnightsForm.getRawValue();

    const filterRequest = {
    } as FilterKnightRequest;

    if (rawForm.nameSearch) {
      filterRequest.nameSearch = rawForm.nameSearch;
    }

    let searchDegrees = '';

    this.searchKnightsForm.controls.searchDegrees.controls.forEach((element: FormGroup<SearchDegreeFormGroup>) => {
      const degree = element.controls.degree.value;
      const checked = element.controls.selected.value;

      if (checked) {
        if (searchDegrees) {
          searchDegrees = searchDegrees + `;${degree}`
        } else {
          searchDegrees = degree;
        }
      }
    });

    if (searchDegrees) {
      filterRequest.searchDegrees = searchDegrees;
    }

    filterRequest.skip = (this.searchKnightsForm.controls.page.value - 1) * this.searchKnightsForm.controls.pageSize.value;
    filterRequest.take = this.searchKnightsForm.controls.pageSize.value;

    console.log(filterRequest);

    return filterRequest;
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

    const observer = {
      next: (knightResponse: Knight) => this.editKnightMemberDuesModal?.resetForm(knightResponse.memberDues),
      error: (err: ApiResponseError) => this.logError('Error getting Knight', err),
      complete: () => console.log('Knight retrieved.'),
    };

    this.getKnightSubscription = this.knightsService.getKnight(this.knightId).subscribe(observer);

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
