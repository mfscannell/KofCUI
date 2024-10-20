import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { KnightDegreeFormOption } from 'src/app/models/inputOptions/knightDegreeFormOption';
import { KnightMemberClassFormOption } from 'src/app/models/inputOptions/knightMemberClassFormOption';
import { KnightMemberTypeFormOption } from 'src/app/models/inputOptions/knightMemberTypeFormOption';
import { KnightInfo } from 'src/app/models/knightInfo';
import { UpdateKnightMembershipInfoRequest } from 'src/app/models/requests/updateKnightMembershipInfoRequest';
import { FormsService } from 'src/app/services/forms.service';
import { KnightsService } from 'src/app/services/knights.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'app-edit-knight-member-info-modal',
  templateUrl: './edit-knight-member-info-modal.component.html',
  styleUrls: ['./edit-knight-member-info-modal.component.scss']
})
export class EditKnightMemberInfoModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() knightInfo?: KnightInfo;
  @Input() knightId: string = '';
  public knightDegreeFormOptions: KnightDegreeFormOption[] = [];
  public knightMemberTypeFormOptions: KnightMemberTypeFormOption[] = [];
  public knightMemberClassFormOptions: KnightMemberClassFormOption[] = [];
  public editKnightMemberInfoForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private getFormsSubscription?: Subscription;
  private updateKnightMembershipInfoSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private formsService: FormsService,
    private knightsService: KnightsService) {
      var today = new Date();
      this.editKnightMemberInfoForm = new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        memberNumber: new UntypedFormControl(0),
        mailReturned: new UntypedFormControl(false),
        degree: new UntypedFormControl('First'),
        firstDegreeDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        reentryDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
        memberType: new UntypedFormControl('Associate'),
        memberClass: new UntypedFormControl('Paying')
      })
  }

  ngOnInit() {
    this.getKnightDegreeFormOptions();
  }

  ngOnDestroy(): void {
    if (this.getFormsSubscription) {
      this.getFormsSubscription.unsubscribe();
    }
    if (this.updateKnightMembershipInfoSubscription) {
      this.updateKnightMembershipInfoSubscription.unsubscribe();
    }
  }

  public onSubmitEditKnightMemberInfo() {
    let knightMembershipInfo = this.mapFormToUpdateMembershipRequest();
    let knightMemberInfoObserver = {
      next: (response: KnightInfo) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight Membership Info", err),
      complete: () => console.log('Knight Membership Info updated.')
    };

    console.log(knightMembershipInfo);

    this.updateKnightMembershipInfoSubscription = this.knightsService.updateKnightMembershipInfo(knightMembershipInfo).subscribe(knightMemberInfoObserver);
  }

  private getKnightDegreeFormOptions() {
    let formsObserver = {
      next: ([ knightDegreeResponse, knightMemberTypeResponse, knightMemberClassResponse ]: [KnightDegreeFormOption[], KnightMemberTypeFormOption[], KnightMemberClassFormOption[]]) => {
        this.knightDegreeFormOptions = knightDegreeResponse;
        this.knightMemberTypeFormOptions = knightMemberTypeResponse;
        this.knightMemberClassFormOptions = knightMemberClassResponse;
        this.populateForm();
      },
      error: (err: any) => this.logError("Error getting Knight Degree Form Options", err),
      complete: () => console.log('Knight Degree Form Options retrieved.')
    };

    this.getFormsSubscription = forkJoin([
      this.formsService.getKnightDegreeFormOptions(),
      this.formsService.getKnightMemberTypeFormOptions(),
      this.formsService.getKnightMemberClassFormOptions()
    ]).subscribe(formsObserver);
  }

  private populateForm() {
    if (this.knightInfo) {
      console.log('knight info:');
      console.log(this.knightInfo)
      this.editKnightMemberInfoForm.patchValue({
        id: this.knightInfo.id,
        memberNumber: this.knightInfo.memberNumber,
        mailReturned: this.knightInfo.mailReturned,
        degree: this.knightInfo.degree,
        firstDegreeDate: DateTimeFormatter.DateTimeToIso8601Date(this.knightInfo.firstDegreeDate), 
        reentryDate: DateTimeFormatter.DateTimeToIso8601Date(this.knightInfo.reentryDate),
        memberType: this.knightInfo.memberType,
        memberClass: this.knightInfo.memberClass
      })
    } else {
      console.log('No kinight info');
    }
  }

  private mapFormToUpdateMembershipRequest(): UpdateKnightMembershipInfoRequest {
    let rawForm = this.editKnightMemberInfoForm.getRawValue();
    let knightInfo: UpdateKnightMembershipInfoRequest = {
      knightId: this.knightId,
      memberNumber: rawForm.memberNumber,
      mailReturned: rawForm.mailReturned,
      degree: rawForm.degree,
      firstDegreeDate: rawForm.firstDegreeDate,
      reentryDate: rawForm.reentryDate,
      memberType: rawForm.memberType,
      memberClass: rawForm.memberClass
    };

    return knightInfo;
  }

  private passBackResponse(response: KnightInfo) {
    this.activeModal.close(response);
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (let key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.errorSaving = true;
  }
}
