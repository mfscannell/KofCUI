import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditMemberDuesFormGroup } from 'src/app/forms/editMemberDuesFormGroup';
import { MemberDueFormGroup } from 'src/app/forms/memberDueFormGroup';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { MemberDues } from 'src/app/models/memberDues';
import { UpdateKnightMemberDuesRequest } from 'src/app/models/requests/updateKnightMemberDuesRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { MemberDuesService } from 'src/app/services/memberDues.service';

@Component({
  selector: 'edit-knight-member-dues-modal',
  templateUrl: './edit-knight-member-dues-modal.component.html',
  styleUrls: ['./edit-knight-member-dues-modal.component.scss'],
})
export class EditKnightMemberDuesModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knightId: string = '';
  @Input() memberDuesPaymentStatusFormOptions: GenericFormOption[] = [];
  @Output() editKnightMemberDuesChanges = new EventEmitter<MemberDues[]>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public editKnightMemberDuesForm: FormGroup<EditMemberDuesFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private updateKnightMemberDuesSubscription?: Subscription;

  constructor(private memberDuesService: MemberDuesService) {
    this.editKnightMemberDuesForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
  }

  public resetForm(memberDues: MemberDues[]): void {
    this.editKnightMemberDuesForm = this.initForm();
    this.errorSaving = false;
    this.errorMessages = [];
    this.patchForm(memberDues);
  }

  private initForm(): FormGroup<EditMemberDuesFormGroup> {
    return new FormGroup<EditMemberDuesFormGroup>({
      memberDues: new FormArray<FormGroup<MemberDueFormGroup>>([]),
    });
  }

  private patchForm(memberDues: MemberDues[]): void {
    if (memberDues) {
      memberDues.forEach((memberDue: MemberDues) => {
        const memberDueFormGroup = new FormGroup<MemberDueFormGroup>({
          year: new FormControl<number>(memberDue.year, { nonNullable: true }),
          paidStatus: new FormControl<string>(memberDue.paidStatus, { nonNullable: true }),
        });

        this.editKnightMemberDuesForm.controls.memberDues.controls.push(memberDueFormGroup);
      });
    }
  }

  public onSubmitEditKnightMemberInfo() {
    const updateKnightMemberDuesRequest = this.mapFormToUpdateKnightMemberDuesRequest();
    const knightMemberDuesObserver = {
      next: (response: MemberDues[]) => this.passBackResponse(response),
      error: (err: ApiResponseError) => this.logError('Error Updating Knight Member Dues', err),
      complete: () => console.log('Knight Info updated.'),
    };

    this.updateKnightMemberDuesSubscription = this.memberDuesService
      .updateKnightMemberDues(updateKnightMemberDuesRequest)
      .subscribe(knightMemberDuesObserver);
  }

  private mapFormToUpdateKnightMemberDuesRequest(): UpdateKnightMemberDuesRequest {
    const mappedMemberDues: MemberDues[] = this.editKnightMemberDuesForm.controls.memberDues.controls.map((memberDueFormGroup: FormGroup<MemberDueFormGroup>) => {
      const memberDues: MemberDues = {
        year: memberDueFormGroup.controls.year.value,
        paidStatus: memberDueFormGroup.controls.paidStatus.value
      };

      return memberDues;
    });
    const request: UpdateKnightMemberDuesRequest = {
      knightId: this.knightId,
      memberDues: mappedMemberDues,
    };

    return request;
  }

  private passBackResponse(response: MemberDues[]) {
    this.editKnightMemberDuesChanges.emit(response);
    this.updateKnightMemberDuesSubscription?.unsubscribe();
    this.closeModal?.nativeElement.click();
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorSaving = true;
  }
}
