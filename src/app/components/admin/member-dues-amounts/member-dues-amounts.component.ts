import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { GetMemberDuesAmountsFormGroup } from 'src/app/forms/getMemberDuesAmountsFormGroup';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { MemberDuesAmounts } from 'src/app/models/memberDuesAmounts';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { FormsService } from 'src/app/services/forms.service';
import { MemberDuesAmountsService } from 'src/app/services/memberDuesAmounts.service';
import { EditMemberDuesAmountsModalComponent } from './edit-member-dues-amounts-modal/edit-member-dues-amounts-modal.component';
import _ from 'lodash';
import { ModalActionType } from 'src/app/types/modal-action.type';

@Component({
  selector: 'member-dues-amounts',
  templateUrl: './member-dues-amounts.component.html',
  styleUrls: ['./member-dues-amounts.component.scss'],
  standalone: false
})
export class MemberDuesAmountsComponent implements OnInit, OnDestroy {
  @ViewChild(EditMemberDuesAmountsModalComponent) editMemberDuesAmountsModal: EditMemberDuesAmountsModalComponent | undefined;
  private getDataSubscription?: Subscription;
  private getMemberDuesAmountsSubscription?: Subscription;
  public memberDuesAmounts: MemberDuesAmounts[] = [];

  public modalAction: ModalActionType = 'Create';
  public modalHeaderText: string = '';
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public memberClassFormOptions: GenericFormOption[] = [];

  private fromYear: number = 0;
  private toYear: number = 0;
  public getMemberDuesAmountsFormGroup: FormGroup<GetMemberDuesAmountsFormGroup>;

  constructor(
    private memberDuesAmountsService: MemberDuesAmountsService,
    private formsService: FormsService) {
      this.toYear = new Date().getFullYear() + 1;
      this.fromYear = this.toYear - 10;
      this.getMemberDuesAmountsFormGroup = this.initForm();
    }

  ngOnInit() {
    this.getFormOptions();
  }

  ngOnDestroy(): void {
    if (this.getDataSubscription) {
      this.getDataSubscription.unsubscribe();
    }

    if (this.getMemberDuesAmountsSubscription) {
      this.getMemberDuesAmountsSubscription.unsubscribe();
    }
  }

  private initForm(): FormGroup<GetMemberDuesAmountsFormGroup> {
    return new FormGroup<GetMemberDuesAmountsFormGroup>({
      fromYear: new FormControl<number>(this.fromYear, {nonNullable: true}),
      toYear: new FormControl<number>(this.toYear, {nonNullable: true})
    })
  }

  public onSubmitSearch() {
    this.getFormOptions();
  }

  public openEditMemberDuesAmountsForYear(memberDuesAmountsForYear: MemberDuesAmounts) {
    this.modalHeaderText = 'Editing Member Dues Amounts';
    this.modalAction = 'Edit';
    this.editMemberDuesAmountsModal?.resetForm(memberDuesAmountsForYear);
  }

  public openCreateMemberDuesAmountsModal(): void {
    this.modalHeaderText = 'Creating Member Dues Amounts';
    this.modalAction = 'Create';
    this.editMemberDuesAmountsModal?.resetForm();
  }

  public addMemberDuesAmountsToList(memberDuesAmounts: MemberDuesAmounts): void {
    let newList = _.cloneDeep(this.memberDuesAmounts) as MemberDuesAmounts[];
    newList.push(memberDuesAmounts);
    newList = newList.sort((a, b) => a.year > b.year ? -1 : a.year < b.year ? 1 : 0);
    this.memberDuesAmounts = newList;
  }

  public updateMemberDuesAmountsInList(memberDuesAmounts: MemberDuesAmounts): void {
    const newList = _.cloneDeep(this.memberDuesAmounts) as MemberDuesAmounts[];
    const index = newList.findIndex((x) => x.year == memberDuesAmounts.year);

    if (newList && index !== undefined && index >= 0) {
      newList[index] = memberDuesAmounts;

      this.memberDuesAmounts = newList;
    }
  }

  private getFormOptions() {
      const getDataObserver = {
        next: ([memberDuesAmounts, memberClassFormOptions]: [MemberDuesAmounts[], GenericFormOption[]]) => {
          this.memberDuesAmounts = memberDuesAmounts;
          this.memberClassFormOptions = memberClassFormOptions;
        },
        error: (err: ApiResponseError) => this.logError('Error getting Activity Form Options', err),
        complete: () => console.log('Activity Form Options retrieved.'),
      };

      const fromYear = this.getMemberDuesAmountsFormGroup.controls.fromYear.value;
      const toYear = this.getMemberDuesAmountsFormGroup.controls.toYear.value;
  
      this.getDataSubscription = forkJoin([
        this.memberDuesAmountsService.getMemberDuesAmounts(fromYear, toYear),
        this.formsService.getKnightMemberClassFormOptions(),
      ]).subscribe(getDataObserver);
    }

    private logError(message: string, err: ApiResponseError) {
      console.error(message);
      console.error(err);
  
      this.errorMessages = [];
      const problemDetails = err.error;
  
      if (problemDetails.detail) {
        this.errorMessages.push(err.error.detail);
      }
  
      for (const key in problemDetails.errors) {
        const errorsArray = problemDetails.errors[key];
        errorsArray.forEach(error => {
          this.errorMessages.push(error);
        })
      }
  
      this.errorSaving = true;
    }
}
