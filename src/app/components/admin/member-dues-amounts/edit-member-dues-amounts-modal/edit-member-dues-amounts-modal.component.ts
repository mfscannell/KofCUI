import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditMemberDuesAmountsFormGroup } from 'src/app/forms/editMemberDuesAmountsFormGroup';
import { MemberDuesAmounts } from 'src/app/models/memberDuesAmounts';
import { CreateMemberDuesAmountsRequest } from 'src/app/models/requests/createMemberDuesAmountsRequest';
import { UpdateMemberDuesAmountsRequest } from 'src/app/models/requests/updateMemberDuesAmountsRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { MemberDuesAmountsService } from 'src/app/services/memberDuesAmounts.service';
import { ModalActionType } from 'src/app/types/modal-action.type';

@Component({
  selector: 'edit-member-dues-amounts-modal',
  templateUrl: './edit-member-dues-amounts-modal.component.html',
  styleUrls: ['./edit-member-dues-amounts-modal.component.scss'],
  standalone: false
})
export class EditMemberDuesAmountsModalComponent implements OnInit, OnDestroy {
  @ViewChild('cancelEditMemberDuesModal', { static: false }) cancelEditMemberDuesModal: ElementRef | undefined;
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionType = 'Create';
  @Output() createMemberDuesAmountsChanges = new EventEmitter<MemberDuesAmounts>();
  @Output() editMemberDuesAmountsChanges = new EventEmitter<MemberDuesAmounts>();
  
  public editMemberDuesAmountsForm: FormGroup<EditMemberDuesAmountsFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private createMemberDuesAmountsSubscription?: Subscription;
  private updateMemberDuesAmountsSubscription?: Subscription;

  constructor(private memberDuesAmountsService: MemberDuesAmountsService) {
    this.editMemberDuesAmountsForm = this.initForm();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.createMemberDuesAmountsSubscription) {
      this.createMemberDuesAmountsSubscription.unsubscribe();
    }

    if (this.updateMemberDuesAmountsSubscription) {
      this.updateMemberDuesAmountsSubscription.unsubscribe();
    }
  }

  public resetForm(memberDuesAmounts?: MemberDuesAmounts) {
    this.editMemberDuesAmountsForm = this.initForm();
    this.editMemberDuesAmountsForm.markAsPristine();
    this.editMemberDuesAmountsForm.markAsUntouched();

    if (memberDuesAmounts) {
      this.patchForm(memberDuesAmounts);
    }
  }

  public cancelModal() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.createMemberDuesAmountsSubscription?.unsubscribe();
    this.updateMemberDuesAmountsSubscription?.unsubscribe();
  }

  public onSubmitEditMemberDuesAmounts() {
    if(!this.editMemberDuesAmountsForm.valid) {
      return;
    }

    if (this.modalAction === 'Edit') {
      const updatedMemberDuesAmounts = this.mapFormToUpdateMemberDuesAmountsRequest();
      this.updateMemberDuesAmounts(updatedMemberDuesAmounts);
    } else if (this.modalAction === 'Create') {
      const newMemberDuesAmounts = this.mapFormToCreateMemberDuesAmountsRequest();
      this.createMemberDuesAmounts(newMemberDuesAmounts);
    }
  }

  private initForm(): FormGroup<EditMemberDuesAmountsFormGroup> {
    const thisYear = new Date().getFullYear();
    return new FormGroup<EditMemberDuesAmountsFormGroup>({
      year: new FormControl<number>(thisYear, { nonNullable: true}),
      memberClassPayingDuesAmount: new FormControl<string>('0.00', { nonNullable: true}),
      memberClassHonoraryLifeDuesAmount: new FormControl<string>('0.00', { nonNullable: true})
    });
  }

  private patchForm(memberDuesAmounts: MemberDuesAmounts) {
    const payingCents = memberDuesAmounts.memberClassPayingDuesAmount * 100;
    const honoraryLifeCents = memberDuesAmounts.memberClassHonoraryLifeDuesAmount * 100

    this.editMemberDuesAmountsForm.patchValue({
      year: memberDuesAmounts.year,
      memberClassPayingDuesAmount: payingCents.toString(),
      memberClassHonoraryLifeDuesAmount: honoraryLifeCents.toString()
    }, {
      emitEvent: true
    });
  }

  private mapFormToCreateMemberDuesAmountsRequest(): CreateMemberDuesAmountsRequest {
    const request: CreateMemberDuesAmountsRequest = {
      year: this.editMemberDuesAmountsForm.controls.year.value,
      memberClassHonoraryLifeDuesAmount: Number(this.editMemberDuesAmountsForm.controls.memberClassHonoraryLifeDuesAmount.value),
      memberClassPayingDuesAmount: Number(this.editMemberDuesAmountsForm.controls.memberClassPayingDuesAmount.value)
    } as CreateMemberDuesAmountsRequest;

    console.log(request);

    return request
  }

  private mapFormToUpdateMemberDuesAmountsRequest(): UpdateMemberDuesAmountsRequest {
    const request: UpdateMemberDuesAmountsRequest = {
      year: this.editMemberDuesAmountsForm.controls.year.value,
      memberClassHonoraryLifeDuesAmount: Number(this.editMemberDuesAmountsForm.controls.memberClassHonoraryLifeDuesAmount.value),
      memberClassPayingDuesAmount: Number(this.editMemberDuesAmountsForm.controls.memberClassPayingDuesAmount.value)
    } as UpdateMemberDuesAmountsRequest;

    console.log(request);

    return request
  }

  private updateMemberDuesAmounts(request: UpdateMemberDuesAmountsRequest) {
    const activityObserver = {
      next: (updatedMemberDuesAmounts: MemberDuesAmounts) => this.passBackUpdatedMemberDuesAmounts(updatedMemberDuesAmounts),
      error: (err: ApiResponseError) => this.logError('Error updating member dues amounts', err),
      complete: () => console.log('Member dues amounts updated.'),
    };

    this.updateMemberDuesAmountsSubscription = this.memberDuesAmountsService.updateMemberDuesAmounts(request).subscribe(activityObserver);
  }

  private createMemberDuesAmounts(request: CreateMemberDuesAmountsRequest) {
    const activityObserver = {
      next: (createdMemberDuesAmounts: MemberDuesAmounts) => this.passBackCreatedMemberDuesAmounts(createdMemberDuesAmounts),
      error: (err: ApiResponseError) => this.logError('Error creating member dues amounts', err),
      complete: () => console.log('Member dues amounts created.'),
    };

    this.createMemberDuesAmountsSubscription = this.memberDuesAmountsService.createMemberDuesAmounts(request).subscribe(activityObserver);
  }

  private passBackUpdatedMemberDuesAmounts(updatedMemberDuesAmounts: MemberDuesAmounts) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editMemberDuesAmountsChanges.emit(updatedMemberDuesAmounts);
    this.updateMemberDuesAmountsSubscription?.unsubscribe();
    this.cancelEditMemberDuesModal?.nativeElement.click();
  }

  private passBackCreatedMemberDuesAmounts(createdMemberDuesAmounts: MemberDuesAmounts) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.createMemberDuesAmountsChanges.emit(createdMemberDuesAmounts);
    this.createMemberDuesAmountsSubscription?.unsubscribe();
    this.cancelEditMemberDuesModal?.nativeElement.click();
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
