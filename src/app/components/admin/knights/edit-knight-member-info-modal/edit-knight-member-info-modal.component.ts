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
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { KnightInfo } from 'src/app/models/knightInfo';
import { UpdateKnightMembershipInfoRequest } from 'src/app/models/requests/updateKnightMembershipInfoRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'edit-knight-member-info-modal',
  templateUrl: './edit-knight-member-info-modal.component.html',
  styleUrls: ['./edit-knight-member-info-modal.component.scss'],
})
export class EditKnightMemberInfoModalComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() modalHeaderText: string = '';
  @Input() knightInfo?: KnightInfo;
  @Input() knightId: string = '';
  @Input() knightDegreeFormOptions: GenericFormOption[] = [];
  @Input() knightMemberTypeFormOptions: GenericFormOption[] = [];
  @Input() knightMemberClassFormOptions: GenericFormOption[] = [];
  @Output() editKnightMemberInfoChanges = new EventEmitter<KnightInfo>();
  @ViewChild('cancelEditKnightMemberInfoChanges', { static: false })
  cancelEditKnightMemberInfoChanges: ElementRef | undefined;

  public editKnightMemberInfoForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightMembershipInfoSubscription?: Subscription;

  constructor(private knightsService: KnightsService) {
    this.editKnightMemberInfoForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  ngOnChanges() {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightMemberInfoForm = this.initForm();
    this.populateForm();
  }

  private initForm() {
    const today = new Date();

    return new UntypedFormGroup({
      id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
      memberNumber: new UntypedFormControl(0),
      mailReturned: new UntypedFormControl(false),
      degree: new UntypedFormControl('First'),
      firstDegreeDate: new UntypedFormControl(
        DateTimeFormatter.ToIso8601Date(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate(),
        ),
      ),
      reentryDate: new UntypedFormControl(
        DateTimeFormatter.ToIso8601Date(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate(),
        ),
      ),
      memberType: new UntypedFormControl('Associate'),
      memberClass: new UntypedFormControl('Paying'),
    });
  }

  public onSubmitEditKnightMemberInfo() {
    const knightMembershipInfo = this.mapFormToUpdateMembershipRequest();
    const knightMemberInfoObserver = {
      next: (response: KnightInfo) => this.passBackResponse(response),
      error: (err: ApiResponseError) =>
        this.logError('Error Updating Knight Membership Info', err),
      complete: () => console.log('Knight Membership Info updated.'),
    };

    console.log(knightMembershipInfo);

    this.updateKnightMembershipInfoSubscription = this.knightsService
      .updateKnightMembershipInfo(knightMembershipInfo)
      .subscribe(knightMemberInfoObserver);
  }

  private populateForm() {
    if (this.knightInfo) {
      console.log('knight info:');
      console.log(this.knightInfo);
      this.editKnightMemberInfoForm.patchValue({
        id: this.knightInfo.id,
        memberNumber: this.knightInfo.memberNumber,
        mailReturned: this.knightInfo.mailReturned,
        degree: this.knightInfo.degree,
        firstDegreeDate: DateTimeFormatter.DateTimeToIso8601Date(
          this.knightInfo.firstDegreeDate,
        ),
        reentryDate: DateTimeFormatter.DateTimeToIso8601Date(
          this.knightInfo.reentryDate,
        ),
        memberType: this.knightInfo.memberType,
        memberClass: this.knightInfo.memberClass,
      });
    } else {
      console.log('No kinight info');
    }
  }

  private mapFormToUpdateMembershipRequest(): UpdateKnightMembershipInfoRequest {
    const rawForm = this.editKnightMemberInfoForm.getRawValue();
    const knightInfo: UpdateKnightMembershipInfoRequest = {
      knightId: this.knightId,
      memberNumber: rawForm.memberNumber,
      mailReturned: rawForm.mailReturned,
      degree: rawForm.degree,
      firstDegreeDate: rawForm.firstDegreeDate,
      reentryDate: rawForm.reentryDate,
      memberType: rawForm.memberType,
      memberClass: rawForm.memberClass,
    };

    return knightInfo;
  }

  private passBackResponse(response: KnightInfo) {
    this.editKnightMemberInfoChanges.emit(response);
    this.cancelEditKnightMemberInfoChanges?.nativeElement.click();

    if (this.updateKnightMembershipInfoSubscription) {
      this.updateKnightMembershipInfoSubscription.unsubscribe();
    }
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
