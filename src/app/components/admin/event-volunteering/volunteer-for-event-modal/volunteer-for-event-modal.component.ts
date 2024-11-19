import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {  FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditVolunteerForEventFormGroup } from 'src/app/forms/editVolunteerForEventFormGroup';
import { EditVolunteerForRoleFormGroup } from 'src/app/forms/editVolunteerForRoleFormGroup';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { Knight } from 'src/app/models/knight';
import { VolunteerForActivityEventRequest } from 'src/app/models/requests/volunteerForActivityEventRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { StreetAddress } from 'src/app/models/streetAddress';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';

@Component({
  selector: 'volunteer-for-event-modal',
  templateUrl: './volunteer-for-event-modal.component.html',
  styleUrls: ['./volunteer-for-event-modal.component.scss'],
})
export class VolunteerForEventModalComponent implements OnInit, OnDestroy, OnChanges {
  public activityEvent: ActivityEvent = {
    id: '',
    activityId: '',
    activityCategory: '',
    eventName: '',
    eventDescription: '',
    startDateTime: '',
    endDateTime: '',
    showInCalendar: true,
    canceled: false,
    canceledReason: '',
    notes: '',
    locationAddress: {
      id: '',
      addressName: '',
      address1: '',
      address2: '',
      city: '',
      stateCode: '',
      postalCode: '',
      countryCode: ''
    } as StreetAddress,
    volunteerSignUpRoles: []
  } as ActivityEvent;
  @Input() allKnights: Knight[] = [];
  @Input() knightId: string = '';
  @Output() editLeadershipRoleChanges = new EventEmitter<ActivityEvent>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  public volunteerForActivityEventForm: FormGroup<EditVolunteerForEventFormGroup>;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private updateVolunteerForActivityEventSubscription?: Subscription;

  constructor(private activityEventsService: ActivityEventsService) {
    this.volunteerForActivityEventForm = this.initForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
  }

  public resetForm(activityEvent: ActivityEvent) {
    this.activityEvent = activityEvent;
    this.errorSaving = false;
    this.errorMessages = [];
    this.volunteerForActivityEventForm = this.initForm();
    this.patchForm(activityEvent);
  }

  private initForm(): FormGroup<EditVolunteerForEventFormGroup> {
    return new FormGroup<EditVolunteerForEventFormGroup>({
      volunteerSignUpRoles: new FormArray<FormGroup<EditVolunteerForRoleFormGroup>>([])
    });
  }

  private patchForm(activityEvent: ActivityEvent) {
    activityEvent.volunteerSignUpRoles.forEach((role: VolunteerSignUpRole) => {
      const knightVolunteeringForRole = role.eventVolunteers.some(ev => ev.knightId === this.knightId);
      const volunteerSignUpRoleFormGroup = new FormGroup<EditVolunteerForRoleFormGroup>({
        volunteerRoleId: new FormControl<string>(role.id, { nonNullable: true }),
        roleTitle: new FormControl<string>(role.roleTitle, { nonNullable: true}),
        numVolunteersNeeded: new FormControl<number>(role.numberOfVolunteersNeeded, { nonNullable: true }),
        volunteerForRole: new FormControl<boolean>(knightVolunteeringForRole, { nonNullable: true})
      });

      this.volunteerForActivityEventForm.controls.volunteerSignUpRoles.controls.push(volunteerSignUpRoleFormGroup);
    });
  }

  public formatVolunteerRole(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      const role = this.activityEvent.volunteerSignUpRoles[index];
      const volunteerRole = `${role.numberOfVolunteersNeeded} ${role.roleTitle}(s)`;

      return volunteerRole;
    }

    return '';
  }

  public onSubmitVolunteerForActivityEvent() {
    if (!this.knightId) {
      return;
    }

    if (!this.activityEvent) {
      return;
    }

    const request = this.mapFormToVolunteerForActivityEventRequest();
    const activityEvent = this.activityEvent;

    const activityEventObserver = {
      next: (eventVolunteers: EventVolunteer[]) => this.passBack(activityEvent, eventVolunteers),
      error: (err: ApiResponseError) => this.logError('Error volunteering for Activity Event', err),
      complete: () => console.log('Activity Event updated.'),
    };

    this.updateVolunteerForActivityEventSubscription = this.activityEventsService.volunteerForActivityEvent(request).subscribe(activityEventObserver);
  }

  private mapFormToVolunteerForActivityEventRequest(): VolunteerForActivityEventRequest {
    const volunteerSignUpRoles: string[] = [];
    console.log('mapFormToVolunteerForActivityEventRequest');
    console.log(this.volunteerForActivityEventForm);

    this.volunteerForActivityEventForm.controls.volunteerSignUpRoles.controls.forEach((formGroup) => {
      if (formGroup.controls.volunteerForRole.value) {
        volunteerSignUpRoles.push(formGroup.controls.volunteerRoleId.value);
      }
    });

    const request: VolunteerForActivityEventRequest = {
      activityEventId: this.activityEvent?.id || '',
      knightId: this.knightId,
      volunteerSignUpRoles: volunteerSignUpRoles,
    };

    console.log(request);

    return request;
  }

  private passBack(activityEvent: ActivityEvent, eventVolunteersResponse: EventVolunteer[]) {
    activityEvent.volunteerSignUpRoles.forEach((existingRole: VolunteerSignUpRole) => {
      const knightUnVolunteered = existingRole.eventVolunteers.some(ev => ev.knightId === this.knightId) && 
      !eventVolunteersResponse.some(ev => ev.volunteerSignUpRoleId === existingRole.id && ev.knightId === this.knightId);

      if (knightUnVolunteered) {
        existingRole.eventVolunteers = existingRole.eventVolunteers.filter(ev => ev.knightId !== this.knightId);
      } else {
        const foundEventVolunteer = eventVolunteersResponse.find(ev => ev.volunteerSignUpRoleId === existingRole.id);

        if (foundEventVolunteer) {
          const foundIndex = existingRole.eventVolunteers.findIndex(ev => ev.knightId === foundEventVolunteer.knightId);

          if (foundIndex > -1) {
            existingRole.eventVolunteers[foundIndex] = foundEventVolunteer;
          } else {
            existingRole.eventVolunteers.push(foundEventVolunteer);
          }
        }
      }
    });

    this.editLeadershipRoleChanges.emit(activityEvent);
    this.updateVolunteerForActivityEventSubscription?.unsubscribe();
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
