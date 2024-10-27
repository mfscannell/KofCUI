import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { ChangeVolunteerForRoleEvent } from 'src/app/models/events/changeVolunteerForRoleEvent';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { EventVolunteersFormGroup } from 'src/app/models/formControls/eventVolunteersFormGroup';
import { VolunteerSignUpRoleFormGroup } from 'src/app/models/formControls/volunteerSignUpRoleFormGroup';
import { Knight } from 'src/app/models/knight';
import { VolunteerForActivityEventRequest } from 'src/app/models/requests/volunteerForActivityEventRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { StreetAddress } from 'src/app/models/streetAddress';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'volunteer-for-event-modal',
  templateUrl: './volunteer-for-event-modal.component.html',
  styleUrls: ['./volunteer-for-event-modal.component.scss']
})
export class VolunteerForEventModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activityEvent?: ActivityEvent;
  @Input() allKnights: Knight[] = [];
  @Input() knightId: string = '';
  @Output() editLeadershipRoleChanges = new EventEmitter<ActivityEvent>();
  @ViewChild('closeModal', {static: false}) closeModal: ElementRef | undefined;

  public volunteerForActivityEventForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public errorMessages: string[] = [];

  private updateVolunteerForActivityEventSubscription?: Subscription;

  constructor(private activityEventsService: ActivityEventsService) {
    this.volunteerForActivityEventForm = this.initForm();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges() {
    this.errorSaving = false;
    this.errorMessages = [];

    if (this.activityEvent) {
      // TODO MFS replace this startTime and endTime JSONS with string.
      this.volunteerForActivityEventForm.patchValue({
        activityEventId: this.activityEvent.id,
        activityId: this.activityEvent.activityId,
        activityCategory: this.activityEvent.activityCategory,
        eventName: this.activityEvent.eventName,
        eventDescription: this.activityEvent.eventDescription,
        startDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEvent.startDateTime),
        startTime: {
          hour: DateTimeFormatter.getHour(this.activityEvent.startDateTime),
          minute: DateTimeFormatter.getMinute(this.activityEvent.startDateTime)
        },
        endDate: DateTimeFormatter.DateTimeToIso8601Date(this.activityEvent.endDateTime),
        endTime: {
          hour: DateTimeFormatter.getHour(this.activityEvent.endDateTime),
          minute: DateTimeFormatter.getMinute(this.activityEvent.endDateTime)
        },
        locationAddress: this.activityEvent.locationAddress,
        showInCalendar: this.activityEvent.showInCalendar,
        canceled: this.activityEvent.canceled,
        canceledReason: this.activityEvent.canceledReason
       });
  
       this.activityEvent.volunteerSignUpRoles?.forEach((role: VolunteerSignUpRole) => {
        const volunteerSignUpRole = new UntypedFormGroup({
          id: new UntypedFormControl(role.id),
          roleTitle: new UntypedFormControl(role.roleTitle),
          startDate: new UntypedFormControl({
            year: DateTimeFormatter.getYear(role.startDateTime),
            month: DateTimeFormatter.getMonth(role.startDateTime),
            day: DateTimeFormatter.getDay(role.startDateTime)
          }),
          startTime: new UntypedFormControl({
            hour: DateTimeFormatter.getHour(role.startDateTime),
            minute: DateTimeFormatter.getMinute(role.startDateTime)
          }),
          endDate: new UntypedFormControl({
            year: DateTimeFormatter.getYear(role.endDateTime),
            month: DateTimeFormatter.getMonth(role.endDateTime),
            day: DateTimeFormatter.getDay(role.endDateTime)
          }),
          endTime: new UntypedFormControl({
            hour: DateTimeFormatter.getHour(role.endDateTime),
            minute: DateTimeFormatter.getMinute(role.endDateTime)
          }),
          numberOfVolunteersNeeded: new UntypedFormControl(role.numberOfVolunteersNeeded),
          volunteerForRole: new UntypedFormControl({
            value: role.eventVolunteers.findIndex(ev => ev.knightId === this.knightId) >= 0,
            disabled: role.eventVolunteers.length >= role.numberOfVolunteersNeeded && role.eventVolunteers.findIndex(ev => ev.knightId === this.knightId) < 0
          }),
          eventVolunteers: new UntypedFormArray(this.initEventVolunteersForm(role.eventVolunteers))
        });
    
        this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
       });
    }
  }

  private initEventVolunteersForm(eventVolunteers: EventVolunteer[] | undefined) {
    const eventVolunteersArray: UntypedFormGroup[] = [];

    if (eventVolunteers) {
      eventVolunteers.forEach((eventVolunteer) => {
        const eventVolunteerFormGroup = new UntypedFormGroup({
          id: new UntypedFormControl(eventVolunteer.id),
          knightId: new UntypedFormControl(eventVolunteer.knightId)
        });

        eventVolunteersArray.push(eventVolunteerFormGroup);
      });
    }

    return eventVolunteersArray;
  }

  public formatEventStartDate() {
    return DateTimeFormatter.ToDisplayedDate(this.activityEvent?.startDateTime);
  }

  public formatEventStartTime() {
    return DateTimeFormatter.ToDisplayTime(this.activityEvent?.startDateTime);
  }

  public formatEventEndTime() {
    return DateTimeFormatter.ToDisplayTime(this.activityEvent?.endDateTime);
  }

  public formatVolunteerRole(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      const role = this.activityEvent.volunteerSignUpRoles[index];
      const volunteerRole = `${role.numberOfVolunteersNeeded} ${role.roleTitle}(s)`;

      return volunteerRole;
    }

    return '';
  }

  public formatVolunteerRoleStartTime(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      const role = this.activityEvent.volunteerSignUpRoles[index];
      const formattedTime = DateTimeFormatter.ToDisplayTime(role.startDateTime);

      return formattedTime;
    }

    return '';
  }

  public formatVolunteerRoleEndTime(index: number) {
    if (this.activityEvent?.volunteerSignUpRoles) {
      const role = this.activityEvent.volunteerSignUpRoles[index];
      const formattedTime = DateTimeFormatter.ToDisplayTime(role.endDateTime);

      return formattedTime;
    }

    return '';
  }

  public getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as UntypedFormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as UntypedFormArray;

    return eventVolunteers.controls;
  }

  public changeVolunteerForRole($event: ChangeVolunteerForRoleEvent, volunteerSignUpRoleIndex: number) {
    console.log($event);
    if ($event.target?.checked) {
      console.log(`Check box checked:${this.knightId}`);
      const eventVolunteerFormGroup = new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        knightId: new UntypedFormControl(this.knightId)
      });

      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as UntypedFormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
      console.log(eventVolunteerFormArray);
      eventVolunteerFormArray.push(eventVolunteerFormGroup);
    } else {
      console.log("Check box unchecked");
      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as UntypedFormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
      const volunteerIndex = eventVolunteerFormArray.controls.findIndex(ctrl => ctrl.value.knightId === this.knightId);

      if (volunteerIndex >= 0) {
        eventVolunteerFormArray.removeAt(volunteerIndex);
      }
    }
  }

  get volunteerSignUpRolesForm() {
    return this.volunteerForActivityEventForm.controls["volunteerSignUpRoles"] as UntypedFormArray;
  }

  private initForm() {
    const today = new Date();
    
    return new UntypedFormGroup({
      activityEventId: new UntypedFormControl(''),
      activityId: new UntypedFormControl(''),
      activityCategory: new UntypedFormControl(''),
      eventName: new UntypedFormControl(''),
      eventDescription: new UntypedFormControl(''),
      startDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      startTime: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Time("2000-01-02T06:00")),
      endDate: new UntypedFormControl(DateTimeFormatter.ToIso8601Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
      endTime: new UntypedFormControl(DateTimeFormatter.DateTimeToIso8601Time("2000-01-02T07:00")),
      locationAddress: new UntypedFormGroup({
        id: new UntypedFormControl('00000000-0000-0000-0000-000000000000'),
        addressName: new UntypedFormControl(''),
        address1: new UntypedFormControl(''),
        address2: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        stateCode: new UntypedFormControl(''),
        postalCode: new UntypedFormControl(''),
        countryCode: new UntypedFormControl('')
      }),
      showInCalendar: new UntypedFormControl(null),
      canceled: new UntypedFormControl({value: null, disabled: true}),
      canceledReason: new UntypedFormControl(''),
      volunteerSignUpRoles: new UntypedFormArray([])
    });
  }

  public onSubmitVolunteerForActivityEvent() {
    if (!this.knightId) {
      return;
    }
    
    const activityEventId = this.activityEvent?.id || '';
    const volunteerSignUpRoles: number[] = [];

    for (let i = 0; i < this.volunteerSignUpRolesForm.length; i++) {
      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(i) as UntypedFormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as UntypedFormArray;
      const volunteerIndex = eventVolunteerFormArray.controls.findIndex(ctrl => ctrl.value.knightId === this.knightId);

      if (volunteerIndex >= 0) {
        const volunteerSignUpRoleId = volunteerSignUpRoleControl.value.id as number;
        volunteerSignUpRoles.push(volunteerSignUpRoleId);
      }
    }

    const request: VolunteerForActivityEventRequest = {
      activityEventId: activityEventId,
      knightId: this.knightId,
      volunteerSignUpRoles: volunteerSignUpRoles
    };

    const activityEvent = this.mapFormToActivityEvent();

    const activityEventObserver = {
      next: (eventVolunteers: EventVolunteer[]) => this.passBack(activityEvent, eventVolunteers),
      error: (err: ApiResponseError) => this.logError('Error volunteering for Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateVolunteerForActivityEventSubscription = this.activityEventsService.volunteerForActivityEvent(request).subscribe(activityEventObserver);
  }

  private mapFormToActivityEvent() {
    const rawForm = this.volunteerForActivityEventForm.getRawValue();
    const volunteerRoles: VolunteerSignUpRole[] = rawForm?.volunteerSignUpRoles?.map(function(role: VolunteerSignUpRoleFormGroup) {
      const volunteerSignUpRole: VolunteerSignUpRole = {
        id: role.id,
        roleTitle: role.roleTitle,
        startDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(role.startDate, role.startTime),
        endDateTime: DateTimeFormatter.DateAndTimeToIso8601DateTime(role.endDate, role.endTime),
        numberOfVolunteersNeeded: role.numberOfVolunteersNeeded,
        eventVolunteers: role.eventVolunteers.map(function(ev: EventVolunteersFormGroup) {
          const eventVolunteer: EventVolunteer = {
            id: ev.id,
            knightId: ev.knightId
          };
          return eventVolunteer;
        })
      };

        return volunteerSignUpRole;
      });
      const locationAddress: StreetAddress = {
        id: rawForm.locationAddress.id,
        addressName: rawForm.locationAddress.addressName,
        address1: rawForm.locationAddress.address1,
        address2: rawForm.locationAddress.address2,
        city: rawForm.locationAddress.city,
        stateCode: rawForm.locationAddress.stateCode,
        postalCode: rawForm.locationAddress.postalCode,
        countryCode: rawForm.locationAddress.countryCode
      };
      const activityEvent: ActivityEvent = {
        id: rawForm.id,
        activityId: rawForm.activityId,
        activityCategory: rawForm.activityCategory,
        eventName: rawForm.eventName,
        eventDescription: rawForm.eventDescription,
        startDateTime: DateTimeFormatter.ToIso8601DateTime(rawForm.startDate.year, rawForm.startDate.month, rawForm.startDate.day, rawForm.startTime.hour, rawForm.startTime.minute) || '1999-01-01T00:00',
        endDateTime: DateTimeFormatter.ToIso8601DateTime(rawForm.endDate.year, rawForm.endDate.month, rawForm.endDate.day, rawForm.endTime.hour, rawForm.endTime.minute) || '1999-01-01T00:00',
        locationAddress: locationAddress,
        volunteerSignUpRoles: volunteerRoles,
        showInCalendar: rawForm.showInCalendar,
        canceled: rawForm.canceled,
        canceledReason: rawForm.canceledReason
      };

      return activityEvent;
  }

  private passBack(activityEvent: ActivityEvent, eventVolunteers: EventVolunteer[]) {
    if (activityEvent.volunteerSignUpRoles) {
      activityEvent.volunteerSignUpRoles.forEach((role) => {
        if (eventVolunteers.findIndex(ev => ev.volunteerSignUpRoleId === role.id) >= 0) {
          role.eventVolunteers.forEach((volunteer) => {
            if (volunteer.knightId === this.knightId) {
              const eventVolunteerId = eventVolunteers.filter(ev => ev.volunteerSignUpRoleId === role.id)[0].id;
              volunteer.id = eventVolunteerId;
            }
          });
        }
      });
    }

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
