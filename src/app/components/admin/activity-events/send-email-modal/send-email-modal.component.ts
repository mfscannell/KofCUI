import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { SendEmailRequest } from 'src/app/models/requests/sendEmailRequest';
import { SendEmailResponse } from 'src/app/models/responses/sendEmailResponse';
import { ActivitiesService } from 'src/app/services/activities.service';

@Component({
  selector: 'kofc-send-email-modal',
  templateUrl: './send-email-modal.component.html',
  styleUrls: ['./send-email-modal.component.scss']
})
export class SendEmailModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() activityEvent?: ActivityEvent;
  private activitiesSubscription?: Subscription;
  public sendEmailForm: UntypedFormGroup;
  public errorSending: boolean = false;
  public errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private activitiesService: ActivitiesService) {
    this.sendEmailForm = new UntypedFormGroup({
      subject: new UntypedFormControl(''),
      body: new UntypedFormControl('')
    });
  }

  ngOnInit() {
    // if (this.activityEvent) {
    //   this.sendEmailForm.patchValue({
    //     subject: this.activityCategory.activityCategoryId,
    //     body: this.activityCategory.categoryName
    //    });
    // }
  }

  ngOnDestroy() {
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }
  }

  onSubmitSendEmail() {
    let sendEmailObserver = {
      next: (sendEmailResponse: SendEmailResponse) => this.showSendEmailResponse(sendEmailResponse),
      error: (err: any) => this.logError('Error sending email', err),
      complete: () => console.log('Email sent.')
    };

    let sendEmailRequest = this.mapFormToRequest();

    this.activitiesSubscription = this.activitiesService.sendEmailAboutActivity(sendEmailRequest).subscribe(sendEmailObserver);
  }

  private mapFormToRequest() {
    let rawForm = this.sendEmailForm.getRawValue();

    let request = new SendEmailRequest({
      activityId: this.activityEvent?.activityId,
      subject: rawForm.subject,
      body: rawForm.body
    });

    return request;
  }

  private showSendEmailResponse(sendEmailResponse: SendEmailResponse) {

  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }

}
