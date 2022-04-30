import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Knight } from 'src/app/models/knight';
import { UpdateKnightPasswordRequest } from 'src/app/models/requests/updateKnightPasswordRequest';
import { UpdateKnightPasswordResponse } from 'src/app/models/responses/updateKnightPasswordResponse';
import { KnightsService } from 'src/app/services/knights.service';

@Component({
  selector: 'kofc-edit-knight-password-modal',
  templateUrl: './edit-knight-password-modal.component.html',
  styleUrls: ['./edit-knight-password-modal.component.scss']
})
export class EditKnightPasswordModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() knight?: Knight;
  editKnightPasswordForm: FormGroup;
  private updateKnightPasswordSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService) {
    this.editKnightPasswordForm = new FormGroup({
      knightId: new FormControl(),
      firstName: new FormControl(),
      middleName: new FormControl(),
      lastName: new FormControl(),
      nameSuffix: new FormControl(),
      password: new FormControl(),
      updatePasswordAtNextLogin: new FormControl()
    });
  }

  ngOnInit() {
    if (this.knight) {
      this.editKnightPasswordForm.patchValue({
        knightId: this.knight.knightId,
        firstName: this.knight.firstName,
        middleName: this.knight.middleName,
        lastName: this.knight.lastName,
        nameSuffix: this.knight.nameSuffix
      });
    }
  }

  ngOnDestroy() {
    if (this.updateKnightPasswordSubscription) {
      this.updateKnightPasswordSubscription.unsubscribe();
    }
  }

  onSubmitEditKnightPassword() {
    let request = this.mapFormToRequest();
    this.updateKnightPassword(request);
  }

  private mapFormToRequest() {
    let rawForm = this.editKnightPasswordForm.getRawValue();
    let request = new UpdateKnightPasswordRequest({
      knightId: rawForm.knightId,
      password: rawForm.password,
      updatePasswordAtNextLogin: rawForm.updatePasswordAtNextLogin
    });

    return request;
  }

  private updateKnightPassword(request: UpdateKnightPasswordRequest) {
    let knightObserver = {
      next: (response: UpdateKnightPasswordResponse) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Updating Knight", err),
      complete: () => console.log('Knight updated.')
    };

    this.updateKnightPasswordSubscription= this.knightsService.updateKnightPassword(request).subscribe(knightObserver);
  }

  private passBackResponse(request: UpdateKnightPasswordResponse) {
    this.activeModal.close(request);
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
