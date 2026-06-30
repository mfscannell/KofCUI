import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditMemberDuesFormGroup } from '@app/forms/editMemberDuesFormGroup';
import { MemberDueFormGroup } from '@app/forms/memberDueFormGroup';
import { GenericFormOption } from '@app/models/inputOptions/genericFormOption';
import { MemberDues } from '@app/models/memberDues';
import { MemberDuesAmounts } from '@app/models/memberDuesAmounts';
import { UpdateKnightMemberDuesRequest } from '@app/models/requests/updateKnightMemberDuesRequest';
import { ApiResponseError } from '@app/models/responses/apiResponseError';
import { MemberDuesService } from '@app/services/memberDues.service';
import { MemberDuesPaidStatus } from '@app/types/knight-member-dues-paid-status.type';

@Component({
  selector: 'edit-knight-member-dues-modal',
  templateUrl: './edit-knight-member-dues-modal.component.html',
  styleUrls: ['./edit-knight-member-dues-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ReactiveFormsModule],
})
export class EditKnightMemberDuesModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knightId: string = '';
  @Input() memberDuesPaymentStatusFormOptions: GenericFormOption[] = [];
  @Input() memberDuesAmounts: MemberDuesAmounts[] = [];
  @Output() editKnightMemberDuesChanges = new EventEmitter<MemberDues[]>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public editKnightMemberDuesForm: FormGroup<EditMemberDuesFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private updateKnightMemberDuesSubscription?: Subscription;
  private memberDuesService = inject(MemberDuesService);

  constructor() {
    this.editKnightMemberDuesForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {}

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
          amountDue: new FormControl<number>(memberDue.amountDue, { nonNullable: true }),
          paidStatus: new FormControl<MemberDuesPaidStatus>(memberDue.paidStatus, { nonNullable: true }),
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
    const mappedMemberDues: MemberDues[] = this.editKnightMemberDuesForm.controls.memberDues.controls.map(
      (memberDueFormGroup: FormGroup<MemberDueFormGroup>) => {
        const memberDues: MemberDues = {
          year: memberDueFormGroup.controls.year.value,
          amountDue: memberDueFormGroup.controls.amountDue.value,
          paidStatus: memberDueFormGroup.controls.paidStatus.value,
        };

        return memberDues;
      },
    );
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

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach((error) => {
        this.errorMessages.push(error);
      });
    }

    this.errorSaving = true;
  }
}
