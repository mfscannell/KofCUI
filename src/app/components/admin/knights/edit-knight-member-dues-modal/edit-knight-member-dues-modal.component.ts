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
} from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MemberDuesFormGroup } from 'src/app/models/formControls/memberDuesFormGroup';
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
  @Input() memberDues?: MemberDues[] = [];
  @Input() knightId: string = '';
  @Input() memberDuesPaymentStatusFormOptions: GenericFormOption[] = [];
  @Output() editKnightMemberDuesChanges = new EventEmitter<MemberDues[]>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public editKnightMemberDuesForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private updateKnightMemberDuesSubscription?: Subscription;

  constructor(private memberDuesService: MemberDuesService) {
    this.editKnightMemberDuesForm = new UntypedFormGroup({
      memberDues: new UntypedFormArray([]),
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightMemberDuesForm = new UntypedFormGroup({
      memberDues: new UntypedFormArray([]),
    });

    this.populateForm();
  }

  get memberDuesFormArray() {
    return this.editKnightMemberDuesForm.controls['memberDues'] as UntypedFormArray;
  }

  getMemberDuesYear(memberDueYear: AbstractControl): string {
    return memberDueYear.getRawValue().year || '';
  }

  private populateForm() {
    if (this.memberDues) {
      this.memberDues.forEach((memberDue: MemberDues) => {
        const memberDueFormGroup = new UntypedFormGroup({
          year: new UntypedFormControl(memberDue.year),
          paidStatus: new UntypedFormControl(memberDue.paidStatus),
        });

        this.memberDuesFormArray.push(memberDueFormGroup);
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
    const rawForm = this.editKnightMemberDuesForm.getRawValue();
    const mappedMemberDues: MemberDues[] = rawForm?.memberDues?.map(function (md: MemberDuesFormGroup): MemberDues {
      const memberDues: MemberDues = {
        year: md.year,
        paidStatus: md.paidStatus,
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
