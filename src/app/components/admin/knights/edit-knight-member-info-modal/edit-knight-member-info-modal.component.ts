import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditKnightMemberInfoFormGroup } from 'src/app/forms/editKnightMemberInfoFormGroup';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { KnightInfo } from 'src/app/models/knightInfo';
import { UpdateKnightMembershipInfoRequest } from 'src/app/models/requests/updateKnightMembershipInfoRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { KnightsService } from 'src/app/services/knights.service';
import { KnightDegree } from 'src/app/types/knight-degree.type';
import { KnightMemberClassType } from 'src/app/types/knight-member-class.type';
import { KnightMemberTypeType } from 'src/app/types/knight-member-type.type';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'edit-knight-member-info-modal',
  templateUrl: './edit-knight-member-info-modal.component.html',
  styleUrls: ['./edit-knight-member-info-modal.component.scss'],
})
export class EditKnightMemberInfoModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() modalHeaderText: string = '';
  @Input() knightId: string = '';
  @Input() knightDegreeFormOptions: GenericFormOption[] = [];
  @Input() knightMemberTypeFormOptions: GenericFormOption[] = [];
  @Input() knightMemberClassFormOptions: GenericFormOption[] = [];
  @Output() editKnightMemberInfoChanges = new EventEmitter<KnightInfo>();
  @ViewChild('cancelEditKnightMemberInfoChanges', { static: false })
  cancelEditKnightMemberInfoChanges: ElementRef | undefined;

  public editKnightMemberInfoForm: FormGroup<EditKnightMemberInfoFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightMembershipInfoSubscription?: Subscription;

  constructor(private knightsService: KnightsService) {
    this.editKnightMemberInfoForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  ngOnChanges() {
  }

  public resetForm(knightInfo: KnightInfo) {
    this.errorSaving = false;
    this.errorMessages = [];
    this.editKnightMemberInfoForm = this.initForm();
    this.populateForm(knightInfo);
  }

  private initForm(): FormGroup<EditKnightMemberInfoFormGroup> {
    const today = new Date();

    return new FormGroup<EditKnightMemberInfoFormGroup>({
      memberNumber: new FormControl<number>(0, { nonNullable: true }),
      mailReturned: new FormControl<boolean>(false, { nonNullable: true }),
      degree: new FormControl<KnightDegree>('First', { nonNullable: true }),
      firstDegreeDate: new FormControl<string>(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), { nonNullable: true }),
      reentryDate: new FormControl<string>(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), { nonNullable: true }),
      memberType: new FormControl<KnightMemberTypeType>('Associate', { nonNullable: true }),
      memberClass: new FormControl<KnightMemberClassType>('Paying', { nonNullable: true }),
    });
  }

  private populateForm(knightInfo: KnightInfo) {
    this.editKnightMemberInfoForm.patchValue({
      memberNumber: knightInfo.memberNumber,
      mailReturned: knightInfo.mailReturned,
      degree: knightInfo.degree,
      firstDegreeDate: DateTimeFormatter.DateTimeToIso8601Date(knightInfo.firstDegreeDate),
      reentryDate: DateTimeFormatter.DateTimeToIso8601Date(knightInfo.reentryDate),
      memberType: knightInfo.memberType,
      memberClass: knightInfo.memberClass,
    });
  }

  public onSubmitEditKnightMemberInfo() {
    const knightMembershipInfo = this.mapFormToUpdateMembershipRequest();
    const knightMemberInfoObserver = {
      next: (response: KnightInfo) => this.passBackResponse(response),
      error: (err: ApiResponseError) => this.logError('Error Updating Knight Membership Info', err),
      complete: () => console.log('Knight Membership Info updated.'),
    };

    console.log(knightMembershipInfo);

    this.updateKnightMembershipInfoSubscription = this.knightsService
      .updateKnightMembershipInfo(knightMembershipInfo)
      .subscribe(knightMemberInfoObserver);
  }

  private mapFormToUpdateMembershipRequest(): UpdateKnightMembershipInfoRequest {
    const knightInfo: UpdateKnightMembershipInfoRequest = {
      knightId: this.knightId,
      memberNumber: this.editKnightMemberInfoForm.controls.memberNumber.value,
      mailReturned: this.editKnightMemberInfoForm.controls.mailReturned.value,
      degree: this.editKnightMemberInfoForm.controls.degree.value,
      firstDegreeDate: this.editKnightMemberInfoForm.controls.firstDegreeDate.value,
      reentryDate: this.editKnightMemberInfoForm.controls.reentryDate.value,
      memberType: this.editKnightMemberInfoForm.controls.memberType.value,
      memberClass: this.editKnightMemberInfoForm.controls.memberClass.value,
    };

    return knightInfo;
  }

  private passBackResponse(response: KnightInfo) {
    this.editKnightMemberInfoChanges.emit(response);
    this.updateKnightMembershipInfoSubscription?.unsubscribe();
    this.cancelEditKnightMemberInfoChanges?.nativeElement.click();
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
