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
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private activitiesSubscription?: Subscription;

  constructor(private activitiesService: ActivitiesService) {
    this.sendEmailForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
    this.sendEmailForm = this.initForm();
    this.errorSaving = false;
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

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach(error => {
        this.errorMessages.push(error);
      })
    }

    this.errorSaving = true;
  }
}
