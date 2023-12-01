import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MemberDuesPayStatusInputOption } from 'src/app/models/inputOptions/memberDuesPayStatusInputOption';
import { MemberDues } from 'src/app/models/memberDues';
import { UpdateKnightMemberDuesRequest } from 'src/app/models/requests/updateKnightMemberDuesRequest';
import { MemberDuesService } from 'src/app/services/memberDues.service';

@Component({
  selector: 'app-edit-knight-member-dues-modal',
  templateUrl: './edit-knight-member-dues-modal.component.html',
  styleUrls: ['./edit-knight-member-dues-modal.component.scss']
})
export class EditKnightMemberDuesModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() memberDues?: MemberDues[] = [];
  @Input() knightId: number = 0;
  public editKnightMemberDuesForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];
  public memberDuesPayStatusInputOptions: MemberDuesPayStatusInputOption[] = MemberDuesPayStatusInputOption.options;
  private updateKnightMemberDuesSubscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private memberDuesService: MemberDuesService
  ) {
    this.editKnightMemberDuesForm = new UntypedFormGroup({
      memberDues: new UntypedFormArray([])
    });
  }

  ngOnInit() {
    if (this.memberDues) {
      this.memberDues.forEach((memberDue: MemberDues) => {
        const memberDueFormGroup = new UntypedFormGroup({
          year: new UntypedFormControl(memberDue.year),
          paidStatus: new UntypedFormControl(memberDue.paidStatus)
        });

        this.memberDuesFormArray.push(memberDueFormGroup);
       });
    }
  }

  ngOnDestroy() {
    if (this.updateKnightMemberDuesSubscription) {
      this.updateKnightMemberDuesSubscription.unsubscribe();
    }
  }

  get memberDuesFormArray() {
    return this.editKnightMemberDuesForm.controls["memberDues"] as UntypedFormArray;
  }

  public onSubmitEditKnightMemberInfo() {
    let updateKnightMemberDuesRequest = this.mapFormToUpdateKnightMemberDuesRequest();
    let knightMemberDuesObserver = {
      next: (response: MemberDues[]) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight Member Dues", err),
      complete: () => console.log('Knight Info updated.')
    };

    this.updateKnightMemberDuesSubscription = this.memberDuesService.updateKnightMemberDues(updateKnightMemberDuesRequest).subscribe(knightMemberDuesObserver);
  }

  private mapFormToUpdateKnightMemberDuesRequest(): UpdateKnightMemberDuesRequest {
    let rawForm = this.editKnightMemberDuesForm.getRawValue();
    let mappedMemberDues: MemberDues[] = rawForm?.memberDues?.map(function(md: any): MemberDues {
      let memberDues: MemberDues = {
        year: md.year,
        paidStatus: md.paidStatus
      };

      return memberDues;
    });
    let request: UpdateKnightMemberDuesRequest = {
      knightId: this.knightId,
      memberDues: mappedMemberDues
    };

    return request;
  }

  private passBackResponse(response: MemberDues[]) {
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