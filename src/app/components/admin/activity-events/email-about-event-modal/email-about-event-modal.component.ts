import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { SendEmailRequest } from 'src/app/models/requests/sendEmailRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { SendEmailResponse } from 'src/app/models/responses/sendEmailResponse';
import { ActivitiesService } from 'src/app/services/activities.service';

@Component({
  selector: 'email-about-event-modal',
  templateUrl: './email-about-event-modal.component.html',
  styleUrls: ['./email-about-event-modal.component.scss'],
})
export class EmailAboutEventModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activityEvent?: ActivityEvent;
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;
  public sendEmailForm: UntypedFormGroup;
  public errorSending: boolean = false;
  public errorMessages: string[] = [];

  private activitiesSubscription?: Subscription;

  constructor(private activitiesService: ActivitiesService) {
    this.sendEmailForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
    this.sendEmailForm = this.initForm();
    this.errorSending = false;
    this.errorMessages = [];
  }

  private initForm() {
    return new UntypedFormGroup({
      subject: new UntypedFormControl(''),
      body: new UntypedFormControl(''),
    });
  }

  public onSubmitSendEmail() {
    const sendEmailObserver = {
      next: (sendEmailResponse: SendEmailResponse) => this.showSendEmailResponse(sendEmailResponse),
      error: (err: ApiResponseError) => this.logError('Error sending email', err),
      complete: () => console.log('Email sent.'),
    };

    const sendEmailRequest = this.mapEmailFormToRequest();

    this.activitiesSubscription = this.activitiesService
      .sendEmailAboutActivity(sendEmailRequest)
      .subscribe(sendEmailObserver);
  }

  private mapEmailFormToRequest() {
    const rawForm = this.sendEmailForm.getRawValue();

    const request: SendEmailRequest = {
      activityId: this.activityEvent?.activityId || '',
      subject: rawForm.subject,
      body: rawForm.body,
    };

    return request;
  }

  private showSendEmailResponse(sendEmailResponse: SendEmailResponse) {
    console.log(sendEmailResponse);
    this.activitiesSubscription?.unsubscribe();
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

    this.errorSending = true;
  }
}
