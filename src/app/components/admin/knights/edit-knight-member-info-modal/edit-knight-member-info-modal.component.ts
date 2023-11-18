import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { KnightDegreeEnums } from 'src/app/enums/knightDegreeEnums';
import { KnightMemberClassEnums } from 'src/app/enums/knightMemberClassEnums';
import { KnightMemberTypeEnums } from 'src/app/enums/knightMemberTypeEnums';
import { KnightDegreeInputOption } from 'src/app/models/inputOptions/knightDegreeInputOption';
import { KnightMemberClassInputOption } from 'src/app/models/inputOptions/knightMemberClassInputOption';
import { KnightMemberTypeInputOption } from 'src/app/models/inputOptions/knightMemberTypeInputOption';
import { KnightInfo } from 'src/app/models/knightInfo';
import { UpdateKnightMembershipInfoRequest } from 'src/app/models/requests/updateKnightMembershipInfoRequest';
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
  @Input() knightId: number = 0;
  public knightDegreeInputOptions = KnightDegreeInputOption.options;
  public knightMemberTypeInputOptions = KnightMemberTypeInputOption.options;
  public knightMemberClassInputOptions = KnightMemberClassInputOption.options;
  public editKnightMemberInfoForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  private updateKnightMembershipInfoSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService) {
      var today = new Date();
      this.editKnightMemberInfoForm = new UntypedFormGroup({
        knightInfoId: new UntypedFormControl(0),
        memberNumber: new UntypedFormControl(0),
        mailReturned: new UntypedFormControl(false),
        degree: new UntypedFormControl(KnightDegreeEnums.First),
        firstDegreeDate: new UntypedFormControl({
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        }),
        reentryDate: new UntypedFormControl({
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
        }),
        memberType: new UntypedFormControl(KnightMemberTypeEnums.Associate),
        memberClass: new UntypedFormControl(KnightMemberClassEnums.Paying)
      })
  }

  ngOnInit() {
    if (this.knightInfo) {
      console.log('knight info:');
      console.log(this.knightInfo)
      this.editKnightMemberInfoForm.patchValue({
        knightInfoId: this.knightInfo.knightInfoId,
        memberNumber: this.knightInfo.memberNumber,
        mailReturned: this.knightInfo.mailReturned,
        degree: this.knightInfo.degree,
        firstDegreeDate: {
          year: DateTimeFormatter.getYear(this.knightInfo.firstDegreeDate),
          month: DateTimeFormatter.getMonth(this.knightInfo.firstDegreeDate),
          day: DateTimeFormatter.getDay(this.knightInfo.firstDegreeDate)
        }, 
        reentryDate: {
          year: DateTimeFormatter.getYear(this.knightInfo.reentryDate),
          month: DateTimeFormatter.getMonth(this.knightInfo.reentryDate),
          day: DateTimeFormatter.getDay(this.knightInfo.reentryDate)
        },
        memberType: this.knightInfo.memberType,
        memberClass: this.knightInfo.memberClass
      })
    } else {
      console.log('No kinight info');
    }
  }

  ngOnDestroy(): void {
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

    this.updateKnightMembershipInfoSubscription = this.knightsService.updateKnightMembershipInfo(knightMembershipInfo).subscribe(knightMemberInfoObserver);
  }

  private mapFormToUpdateMembershipRequest(): UpdateKnightMembershipInfoRequest {
    let rawForm = this.editKnightMemberInfoForm.getRawValue();
    let knightInfo: UpdateKnightMembershipInfoRequest = {
      knightId: this.knightId,
      memberNumber: rawForm.memberNumber,
      mailReturned: rawForm.mailReturned,
      degree: rawForm.degree,
      firstDegreeDate: DateTimeFormatter.ToIso8601Date(
        rawForm.firstDegreeDate.year, 
        rawForm.firstDegreeDate.month, 
        rawForm.firstDegreeDate.day),
      reentryDate: DateTimeFormatter.ToIso8601Date(
        rawForm.reentryDate.year, 
        rawForm.reentryDate.month, 
        rawForm.reentryDate.day),
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
