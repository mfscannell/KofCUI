import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject, Subscription } from 'rxjs';

import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { UploadKnightsModalComponent } from 'src/app/components/admin/knights/upload-knights-modal/upload-knights-modal.component';
import { EditKnightPasswordModalComponent } from './edit-knight-password-modal/edit-knight-password-modal.component';
import { KnightUser } from 'src/app/models/knightUser';
import { EditKnightPersonalInfoModalComponent } from './edit-knight-personal-info-modal/edit-knight-personal-info-modal.component';
import { EditKnightActivityInterestsModalComponent } from './edit-knight-activity-interests-modal/edit-knight-activity-interests-modal.component';
import { ActivityInterest } from 'src/app/models/activityInterest';
import { EditKnightMemberDuesModalComponent } from './edit-knight-member-dues-modal/edit-knight-member-dues-modal.component';
import { MemberDues } from 'src/app/models/memberDues';
import { EditKnightMemberInfoModalComponent } from './edit-knight-member-info-modal/edit-knight-member-info-modal.component';
import { KnightInfo } from 'src/app/models/knightInfo';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { StreetAddress } from 'src/app/models/streetAddress';
import { FormsService } from 'src/app/services/forms.service';
import { ActivityCategoryFormOption } from 'src/app/models/inputOptions/activityCategoryFormOption';
import { CountryFormOption } from 'src/app/models/inputOptions/countryFormOption';
import { KnightDegreeFormOption } from 'src/app/models/inputOptions/knightDegreeFormOption';
import { KnightMemberTypeFormOption } from 'src/app/models/inputOptions/knightMemberTypeFormOption';
import { KnightMemberClassFormOption } from 'src/app/models/inputOptions/knightMemberClassFormOption';
import { MemberDuesPaymentStatusFormOption } from 'src/app/models/inputOptions/memberDuesPaymentStatusFormOption';
import { AdministrativeDivisionFormOption } from 'src/app/models/inputOptions/administrativeDivisionFormOption';
import { KnightActivityInterestsService } from 'src/app/services/knightActivityInterests.service';
import { UpdateKnightPersonalInfoRequest } from 'src/app/models/requests/updateKnightPersonalInfoRequest';

@Component({
  selector: 'knights',
  templateUrl: './knights.component.html',
  styleUrls: ['./knights.component.scss']
})
export class KnightsComponent implements OnInit, OnDestroy {
  allKnights: Knight[] = [];
  displayedKnights: Knight[] = [];
  displayedKnightsCount: number = 0;
  private knightsSubscription?: Subscription;
  private createKnightSubscription?: Subscription;
  private getFormsSubscription?: Subscription;
  private updateKnightPersonalInfoSubscription?: Subscription;
  knightsLoaded: boolean = false;
  page = 1;
  pageSize = 20;
  maxSize = 10;

  private _search$ = new Subject<void>();

  private knightActivityInterestsForNewKnight: ActivityInterest[] = [];
  public countryFormOptions: CountryFormOption[] = [];
  public activityCategoryFormOptions: ActivityCategoryFormOption[] = [];
  public knightDegreeFormOptions: KnightDegreeFormOption[] = [];
  public knightMemberTypeFormOptions: KnightMemberTypeFormOption[] = [];
  public knightMemberClassFormOptions: KnightMemberClassFormOption[] = [];
  public memberDuesPaymentStatusFormOptions: MemberDuesPaymentStatusFormOption[] = [];
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public createKnightForm: UntypedFormGroup;
  public editKnightPersonalInfoForm: UntypedFormGroup;
  @ViewChild('cancelCreateKnightModal', {static: false}) cancelCreateKnightModal: ElementRef | undefined;
  @ViewChild('cancelEditKnightPersonalInfoModal', {static: false}) cancelEditKnightPersonalInfoModal: ElementRef | undefined;

  constructor(
    private formsService: FormsService,
    private knightsService: KnightsService,
    private knightActivityInterestsService: KnightActivityInterestsService,
    private modalService: NgbModal) {
      this.createKnightForm = this.initCreateKnightForm();
      this.editKnightPersonalInfoForm = this.initEditKnightPersonalInfoForm();
  }

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

  private initCreateKnightForm() {
    let today = new Date();
    let createKnightForm = new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      firstName: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(63)
      ]),
      middleName: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      lastName: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      nameSuffix: new UntypedFormControl('', [
        Validators.maxLength(7)
      ]),
      dateOfBirth: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      emailAddress: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      cellPhoneNumber: new UntypedFormControl('', [
        Validators.maxLength(31)
      ]),
      homeAddress: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        addressName: new UntypedFormControl(null),
        address1: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        address2: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        city: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        stateCode: new UntypedFormControl('', [
          Validators.maxLength(3)
        ]),
        postalCode: new UntypedFormControl('', [
          Validators.maxLength(15)
        ]),
        countryCode: new UntypedFormControl('', [
          Validators.maxLength(7)
        ])
      }),
      knightInfo: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        memberNumber: new UntypedFormControl(0),
        mailReturned: new UntypedFormControl(false),
        degree: new UntypedFormControl('First'),
        firstDegreeDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        reentryDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        memberType: new UntypedFormControl('Associate'),
        memberClass: new UntypedFormControl('Paying')
      }),
      memberDues: new UntypedFormArray([]),
      activityInterests: new UntypedFormGroup({
        communityActivityInterests: new UntypedFormArray([]),
        faithActivityInterests: new UntypedFormArray([]),
        familyActivityInterests: new UntypedFormArray([]),
        lifeActivityInterests: new UntypedFormArray([]),
        miscellaneousActivityInterests: new UntypedFormArray([])
      })
    });

    this.updateFormWithActivityInterests(createKnightForm, this.knightActivityInterestsForNewKnight);
    this.updateFormWithMemberDuesForCreateKnightForm(createKnightForm);

    return createKnightForm;
  }

  private initEditKnightPersonalInfoForm() {
    var today = new Date();

    return new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      firstName: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(63)
      ]),
      middleName: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      lastName: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      nameSuffix: new UntypedFormControl('', [
        Validators.maxLength(7)
      ]),
      dateOfBirth: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      emailAddress: new UntypedFormControl('', [
        Validators.maxLength(63)
      ]),
      cellPhoneNumber: new UntypedFormControl('', [
        Validators.maxLength(31)
      ]),
      homeAddress: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        addressName: new UntypedFormControl(null),
        address1: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        address2: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        city: new UntypedFormControl('', [
          Validators.maxLength(63)
        ]),
        stateCode: new UntypedFormControl('', [
          Validators.maxLength(3)
        ]),
        postalCode: new UntypedFormControl('', [
          Validators.maxLength(15)
        ]),
        countryCode: new UntypedFormControl('', [
          Validators.maxLength(7)
        ])
      })
    });
  }

  private updateFormWithActivityInterests(form: UntypedFormGroup, activityInterests: ActivityInterest[]) {
    this.activityCategoryFormOptions.forEach(activityCategoryFormOption => {
      let activityInterestsFormArray = this.getActivityInterestsFormArray(form, `${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`);
      let filteredActivities = activityInterests?.filter(activityInterest => {
        return activityInterest.activityCategory === activityCategoryFormOption.value;
      });
      filteredActivities?.forEach((activityInterest: ActivityInterest) => {
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

  private updateFormWithMemberDuesForCreateKnightForm(form: UntypedFormGroup) {
    let thisYear = new Date().getFullYear();
      let startYear = thisYear - 9;
      let endYear = thisYear + 1;

      for (let year = startYear; year <= endYear; year++) {
        const memberDueFormGroup = new UntypedFormGroup({
          memberDuesId: new UntypedFormControl(0),
          year: new UntypedFormControl(year),
          paidStatus: new UntypedFormControl('Unpaid')
        });

        this.appendMemberDues(form, memberDueFormGroup)
      }
  }

  private getAllKnights() {
    let formsObserver = {
      next: (
        [
          knightsResponse,
          activityCategoriesResponse,
          knightDegreeResponse,
          knightMemberTypeResponse,
          knightMemberClassResponse,
          countryResponse,
          memberDuesPaymentStatusResponse,
          knightActivityInterests
        ]: 
        [
          Knight[],
          ActivityCategoryFormOption[],
          KnightDegreeFormOption[],
          KnightMemberTypeFormOption[],
          KnightMemberClassFormOption[],
          CountryFormOption[],
          MemberDuesPaymentStatusFormOption[],
          ActivityInterest[]
        ]) => {
        this.activityCategoryFormOptions = activityCategoriesResponse;
        this.knightDegreeFormOptions = knightDegreeResponse;
        this.knightMemberTypeFormOptions = knightMemberTypeResponse;
        this.knightMemberClassFormOptions = knightMemberClassResponse;
        this.countryFormOptions = countryResponse;
        this.memberDuesPaymentStatusFormOptions = memberDuesPaymentStatusResponse;
        this.knightActivityInterestsForNewKnight = knightActivityInterests;
        this.applySearchFilter(knightsResponse)
      },
      error: (err: any) => this.logError("Error getting Knight Degree Form Options", err),
      complete: () => console.log('Knight Degree Form Options retrieved.')
    };

    this.getFormsSubscription = forkJoin([
      this.knightsService.getAllKnights(),
      this.formsService.getActivityCategoryFormOptions(),
      this.formsService.getKnightDegreeFormOptions(),
      this.formsService.getKnightMemberTypeFormOptions(),
      this.formsService.getKnightMemberClassFormOptions(),
      this.formsService.getCountryFormOptions(),
      this.formsService.getMemberDuesPaymentStatusFormOptions(),
      this.knightActivityInterestsService.getAllIKnightActivityInterestsForNewKnight()
    ]).subscribe(formsObserver);
  }

  public enableDisableAdministrativeDivisions(form: UntypedFormGroup): void {
    let countryCode = this.getCountryCode(form);
    let hasCountryCode = this.countryFormOptions.some(cfo => cfo.value === countryCode);

    console.log(`hasCOuntry: ${hasCountryCode}. countryCode ${countryCode}`);

    if (hasCountryCode) {
      console.log(this.createKnightForm.get('homeAddress.stateCode'));
      this.createKnightForm.get('homeAddress.stateCode')?.enable();
    } else {
      console.log(this.createKnightForm.get('homeAddress.stateCode'));
      this.createKnightForm.get('homeAddress.stateCode')?.disable();
    }
  }

  private getCountryCode(form: UntypedFormGroup): string {
    return form.get('homeAddress.countryCode')?.value;
  }

  public filterAdministrativeDivisionsByCountry(form: UntypedFormGroup): AdministrativeDivisionFormOption[] {
    let countryCode = this.getCountryCode(form);

    let filteredCountryFormOptions = this.countryFormOptions.filter(cfo => cfo.value === countryCode);

    if (filteredCountryFormOptions && filteredCountryFormOptions.length) {
      return filteredCountryFormOptions[0].administrativeDivisions;
    }

    return [];
  }

  public getFormArrayName(activityCategoryFormOption: ActivityCategoryFormOption) {
    return `${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`;
  }

  public getActivityInterestsFormArray(form: UntypedFormGroup, activityCategory: string): UntypedFormArray {
    let activityInterestsFormGroup = form.controls['activityInterests'] as UntypedFormGroup;
    let activityInterestsFormArray = activityInterestsFormGroup.controls[activityCategory] as UntypedFormArray;

    return activityInterestsFormArray;
  }

  public getActivityName(activityInterest: AbstractControl): string {
    let rawValue = activityInterest.getRawValue();
    let activityName = rawValue.activityName;

    return activityName as string;
  }

  public getMemberDuesYear(memberDueYear: AbstractControl): string {
    return memberDueYear.getRawValue().year || '';
  }

  getMemberDuesForm(form: UntypedFormGroup) {
    return form.controls["memberDues"] as UntypedFormArray;
  }

  appendMemberDues(form: UntypedFormGroup, memberDueFormGroup: UntypedFormGroup) {
    let something = form.controls["memberDues"] as UntypedFormArray;
    something.push(memberDueFormGroup);
  }

  private applySearchFilter(knights: Knight[]) {
    this.allKnights = knights;
    this.displayedKnights = knights;
    this.displayedKnightsCount = this.allKnights.length;
    this.knightsLoaded = true;
  }

  searchPartialName(event: any) {
    let text = event.target.value.toLowerCase();
    this.page = 1;
    this.displayedKnights = this.allKnights.filter(knight => 
      (knight.firstName && knight.firstName.toLowerCase().includes(text)) || (knight.lastName && knight.lastName.toLowerCase().includes(text)));
  }

  openEditKnightPersonalInfoModal(knight: Knight) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightPersonalInfoForm = this.initEditKnightPersonalInfoForm();
    this.enableDisableAdministrativeDivisions(this.editKnightPersonalInfoForm);

    this.editKnightPersonalInfoForm.patchValue({
      id: knight.id,
      firstName: knight.firstName,
      middleName: knight.middleName,
      lastName: knight.lastName,
      nameSuffix: knight.nameSuffix,
      dateOfBirth: DateTimeFormatter.DateTimeToIso8601Date(knight.dateOfBirth),
      emailAddress: knight.emailAddress,
      cellPhoneNumber: knight.cellPhoneNumber,
      homeAddress: knight.homeAddress
    });
  }

  public onSubmitEditKnightPersonalInfo() {
    let updateKnightPersonalInfoRequest = this.mapFormToKnightPersonalInfo();
    let knightMemberInfoObserver = {
      next: (response: Knight) => this.updateKnightPersonalInfoInList(response),
      error: (err: any) => this.logError("Error Updating Knight Info", err),
      complete: () => console.log('Knight Info updated.')
    };

    this.updateKnightPersonalInfoSubscription = this.knightsService.updateKnightPersonalInfo(updateKnightPersonalInfoRequest).subscribe(knightMemberInfoObserver);
  }

  private mapFormToKnightPersonalInfo(): UpdateKnightPersonalInfoRequest {
    let rawForm = this.editKnightPersonalInfoForm.getRawValue();
    console.log("mapFormToKnightPersonalInfo");
    console.log(rawForm);
    let homeAddress: StreetAddress = {
      id: rawForm.homeAddress.id,
      addressName: rawForm.homeAddress.addressName,
      address1: rawForm.homeAddress.address1,
      address2: rawForm.homeAddress.address2,
      city: rawForm.homeAddress.city,
      stateCode: rawForm.homeAddress.stateCode,
      postalCode: rawForm.homeAddress.postalCode,
      countryCode: rawForm.homeAddress.countryCode
    };
    let knight: UpdateKnightPersonalInfoRequest = {
      knightId: rawForm.id,
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: rawForm.dateOfBirth,
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress
    };

    return knight;
  }

  openEditKnightActivityInterestsModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightActivityInterestsModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.activityInterests = knight.activityInterests;
    modalRef.componentInstance.knightId = knight.id;
    modalRef.componentInstance.modalHeaderText = `Editing Activity Interests for ${knight.firstName} ${knight.lastName}`;
    modalRef.result.then((result: ActivityInterest[]) => {
      if (result) {
        this.updateKnightActivityInterestsInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Activity Interests Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightMemberDuesModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightMemberDuesModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.memberDues = knight.memberDues;
    modalRef.componentInstance.knightId = knight.id;
    modalRef.componentInstance.modalHeaderText = `Editing Member Dues for ${knight.firstName} ${knight.lastName}`;
    modalRef.result.then((result: MemberDues[]) => {
      if (result) {
        this.updateKnightMemberDuesInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Member Dues Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightMemberInfoModal(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightMemberInfoModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knightInfo = knight.knightInfo;
    modalRef.componentInstance.knightId = knight.id;
    modalRef.componentInstance.modalHeaderText = `Editing Member Info for ${knight.firstName} ${knight.lastName}`;
    modalRef.result.then((result: KnightInfo) => {
      if (result) {
        this.updateKnightMemberInfoInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Member Info Modal.');
        console.log(error);
      }
    });
  }

  openEditKnightPassword(knight: Knight) {
    const modalRef = this.modalService.open(EditKnightPasswordModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.knightUser = knight.knightUser;
    modalRef.componentInstance.modalHeaderText = `Editing Knight Password for ${knight.firstName} ${knight.lastName}`;
    modalRef.componentInstance.knightsFullName = `${knight.firstName} ${knight.lastName}`;
    modalRef.componentInstance.knightId = knight.id;
    modalRef.result.then((result: KnightUser) => {
      if (result) {
        this.updateKnightUserInList(knight, result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Knight Password Modal.');
        console.log(error);
      }
    });
  }

  private updateKnightPersonalInfoInList(knight: Knight) {
    let index = this.allKnights?.findIndex(x => x.id == knight.id);

    if (this.allKnights && index !== undefined && index >= 0) {
      knight.knightInfo = this.allKnights[index].knightInfo;
      knight.memberDues = this.allKnights[index].memberDues;
      knight.activityInterests = this.allKnights[index].activityInterests;
      knight.knightUser = this.allKnights[index].knightUser;

      this.allKnights[index] = knight;
    }

    this.cancelEditKnightPersonalInfoModal?.nativeElement.click();
  }

  private updateKnightActivityInterestsInList(knight: Knight, activityInterests: ActivityInterest[]) {
    let index = this.allKnights?.findIndex(x => x.id == knight.id);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].activityInterests = activityInterests;
    }
  }

  private updateKnightMemberDuesInList(knight: Knight, memberDues: MemberDues[]) {
    let index = this.allKnights?.findIndex(x => x.id == knight.id);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].memberDues = memberDues;
    }
  }

  private updateKnightMemberInfoInList(knight: Knight, knightMemberInfo: KnightInfo) {
    let index = this.allKnights?.findIndex(x => x.id == knight.id);

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].knightInfo = knightMemberInfo;
    }
  }

  private updateKnightUserInList(knight: Knight, knightUser: KnightUser) {
    let index = this.allKnights?.findIndex(x => x.id == knight.id)

    if (this.allKnights && index !== undefined && index >= 0) {
      this.allKnights[index].knightUser = knightUser;
    }
  }

  openCreateKnightModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.createKnightForm = this.initCreateKnightForm();
    this.enableDisableAdministrativeDivisions(this.createKnightForm);
  }

  onSubmitCreateKnight() {
    let mappedKnight = this.mapCreateKnightFormToKnight();

    let knightObserver = {
      next: (response: Knight) => this.addKnightToAllKnights(response),
      error: (err: any) => this.logError("Error Creating Knight", err),
      complete: () => console.log('Knight created.')
    };

    this.createKnightSubscription = this.knightsService.createKnightAndActivityInterest(mappedKnight).subscribe(knightObserver);
  }

  private mapCreateKnightFormToKnight() {
    let rawForm = this.createKnightForm.getRawValue();
    let homeAddress: StreetAddress = {
      id: rawForm.homeAddress.id,
      address1: rawForm.homeAddress.address1,
      address2: rawForm.homeAddress.address2,
      city: rawForm.homeAddress.city,
      stateCode: rawForm.homeAddress.stateCode,
      postalCode: rawForm.homeAddress.postalCode,
      countryCode: rawForm.homeAddress.countryCode
    };
    let knightInfo: KnightInfo = {
      id: rawForm.knightInfo.id,
      memberNumber: rawForm.knightInfo.memberNumber,
      mailReturned: rawForm.knightInfo.mailReturned,
      degree: rawForm.knightInfo.degree,
      firstDegreeDate: rawForm.knightInfo.firstDegreeDate,
      reentryDate: rawForm.knightInfo.reentryDate,
      memberType: rawForm.knightInfo.memberType,
      memberClass: rawForm.knightInfo.memberClass
    };
    let _memberDues: MemberDues[] = rawForm?.memberDues?.map(function(md: any): MemberDues {
      let memberDues: MemberDues = {
        year: md.year,
        paidStatus: md.paidStatus
      };

      return memberDues;
    });
    let knight: Knight = {
      id: rawForm.id,
      firstName: rawForm.firstName,
      middleName: rawForm.middleName,
      lastName: rawForm.lastName,
      nameSuffix: rawForm.nameSuffix,
      dateOfBirth: rawForm.dateOfBirth,
      emailAddress: rawForm.emailAddress,
      cellPhoneNumber: rawForm.cellPhoneNumber,
      homeAddress: homeAddress,
      knightInfo: knightInfo,
      activityInterests: [],
      memberDues: _memberDues
    };

    this.activityCategoryFormOptions.forEach(activityCategoryFormOption => {
      let activityInterests = rawForm['activityInterests'][`${activityCategoryFormOption.value.toLowerCase()}ActivityInterests`];

      activityInterests.forEach((ai: any) => {
        console.log(ai);
        knight.activityInterests.push({
          activityId: ai.activityId,
          activityName: ai.activityName,
          activityCategory: ai.activityCategory,
          interested: ai.interested
        });
      });
    });

    console.log('Mapped Knight:');
    console.log(knight);

    return knight;
  }

  openUploadKnightsModal() {
    const modalRef = this.modalService.open(UploadKnightsModalComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});

    modalRef.componentInstance.modalHeaderText = 'Upload Knights From File';
    modalRef.result.then((result: Knight[]) => {
      if (result) {
        this.addKnights(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from uploading knights modal.', error);
      }
    });
  }

  private addKnightToAllKnights(knight: Knight) {
    this.allKnights?.push(knight);
    this.cancelCreateKnightModal?.nativeElement.click();
  }

  private addKnights(knights: Knight[]) {
    knights.forEach(k => this.allKnights.push(k));
  }

  private logError(errorMessage: string, error: any) {

  }
}
