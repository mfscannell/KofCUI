import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { Activity } from 'src/app/models/activity';
import { VolunteerSignUpRole } from 'src/app/models/volunteerSignUpRole';
import { AddressState } from 'src/app/models/addressState';
import { Country } from 'src/app/models/country';
import { StreetAddress } from 'src/app/models/streetAddress';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { Knight } from 'src/app/models/knight';
import { VolunteerForActivityEventRequest } from 'src/app/models/requests/volunteerForActivityEventRequest';
import { AccountsService } from 'src/app/services/accounts.service';
import { ActivityCategoryEnums } from 'src/app/enums/activityCategoryEnums';

@Component({
  selector: 'kofc-volunteer-for-activity-event-modal',
  templateUrl: './volunteer-for-activity-event-modal.component.html',
  styleUrls: ['./volunteer-for-activity-event-modal.component.scss']
})
export class VolunteerForActivityEventModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() activityEvent?: ActivityEvent;
  @Input() allKnights: Knight[] = [];
  activityCategories: ActivityCategoryEnums[] = Object.values(ActivityCategoryEnums);
  knightId?: number;
  updateVolunteerForActivityEventSubscription?: Subscription;
  volunteerForActivityEventForm: FormGroup;
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  errorSaving: boolean = false;
  errorMessages: string[] = [];
  disableTime: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private activityEventsService: ActivityEventsService,
    private accountsService: AccountsService) {
    var today = new Date();
    this.volunteerForActivityEventForm = new FormGroup({
      activityEventId: new FormControl(''),
      activityId: new FormControl(''),
      activityCategory: new FormControl(''),
      eventName: new FormControl(''),
      eventDescription: new FormControl(''),
      startDate: new FormControl({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      }),
      startTime: new FormControl({
        "hour": 6,
        "minute": 0
      }),
      endDate: new FormControl({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      }),
      endTime: new FormControl({
        "hour": 7,
        "minute": 0
      }),
      locationAddress: new FormGroup({
        streetAddressId: new FormControl(''),
        addressName: new FormControl(''),
        address1: new FormControl(''),
        address2: new FormControl(''),
        city: new FormControl(''),
        stateCode: new FormControl(''),
        postalCode: new FormControl(''),
        countryCode: new FormControl('')
      }),
      showInCalendar: new FormControl(null),
      canceled: new FormControl({value: null, disabled: true}),
      canceledReason: new FormControl(''),
      volunteerSignUpRoles: new FormArray([])
     });
  }

  ngOnInit() {
    this.knightId = this.accountsService.getKnightId();

    if (this.activityEvent) {
      this.volunteerForActivityEventForm.patchValue({
        activityEventId: this.activityEvent.activityEventId,
        activityId: this.activityEvent.activityId,
        activityCategory: this.activityEvent.activityCategory,
        eventName: this.activityEvent.eventName,
        eventDescription: this.activityEvent.eventDescription,
        startDate: {
          year: DateTimeFormatter.getYear(this.activityEvent.startDateTime),
          month: DateTimeFormatter.getMonth(this.activityEvent.startDateTime),
          day: DateTimeFormatter.getDay(this.activityEvent.startDateTime)
        },
        startTime: {
          hour: DateTimeFormatter.getHour(this.activityEvent.startDateTime),
          minute: DateTimeFormatter.getMinute(this.activityEvent.startDateTime)
        },
        endDate: {
          year: DateTimeFormatter.getYear(this.activityEvent.endDateTime),
          month: DateTimeFormatter.getMonth(this.activityEvent.endDateTime),
          day: DateTimeFormatter.getDay(this.activityEvent.endDateTime)
        },
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
        const volunteerSignUpRole = new FormGroup({
          volunteerSignUpRoleId: new FormControl(role.volunteerSignupRoleId),
          roleTitle: new FormControl(role.roleTitle),
          startDate: new FormControl({
            year: DateTimeFormatter.getYear(role.startDateTime),
            month: DateTimeFormatter.getMonth(role.startDateTime),
            day: DateTimeFormatter.getDay(role.startDateTime)
          }),
          startTime: new FormControl({
            hour: DateTimeFormatter.getHour(role.startDateTime),
            minute: DateTimeFormatter.getMinute(role.startDateTime)
          }),
          endDate: new FormControl({
            year: DateTimeFormatter.getYear(role.endDateTime),
            month: DateTimeFormatter.getMonth(role.endDateTime),
            day: DateTimeFormatter.getDay(role.endDateTime)
          }),
          endTime: new FormControl({
            hour: DateTimeFormatter.getHour(role.endDateTime),
            minute: DateTimeFormatter.getMinute(role.endDateTime)
          }),
          numberOfVolunteersNeeded: new FormControl(role.numberOfVolunteersNeeded),
          volunteerForRole: new FormControl({
            value: role.eventVolunteers.findIndex(ev => ev.knightId === this.knightId) >= 0,
            disabled: role.eventVolunteers.length >= role.numberOfVolunteersNeeded && role.eventVolunteers.findIndex(ev => ev.knightId === this.knightId) < 0
          }),
          eventVolunteers: new FormArray(this.initEventVolunteersForm(role.eventVolunteers))
        });
    
        this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
       });
    }
  }

  ngOnDestroy() {
    if (this.updateVolunteerForActivityEventSubscription) {
      this.updateVolunteerForActivityEventSubscription.unsubscribe();
    }
  }

  private initEventVolunteersForm(eventVolunteers: EventVolunteer[] | undefined) {
    let eventVolunteersArray: FormGroup[] = [];

    if (eventVolunteers) {
      eventVolunteers.forEach((eventVolunteer) => {
        const eventVolunteerFormGroup = new FormGroup({
          eventVolunteerId: new FormControl(eventVolunteer.eventVolunteerId),
          knightId: new FormControl(eventVolunteer.knightId)
        });

        eventVolunteersArray.push(eventVolunteerFormGroup);
      });
    }

    return eventVolunteersArray;
  }

  get volunteerSignUpRolesForm() {
    return this.volunteerForActivityEventForm.controls["volunteerSignUpRoles"] as FormArray;
  }

  getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as FormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as FormArray;

    return eventVolunteers.controls;
  }

  changeVolunteerForRole($event: any, volunteerSignUpRoleIndex: number) {
    if ($event.target.checked) {
      const eventVolunteerFormGroup = new FormGroup({
        eventVolunteerId: new FormControl(''),
        knightId: new FormControl(this.knightId)
      })

      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as FormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as FormArray;
      eventVolunteerFormArray.push(eventVolunteerFormGroup);
    } else {
      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as FormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as FormArray;
      let volunteerIndex = eventVolunteerFormArray.controls.findIndex(ctrl => ctrl.value.knightId === this.knightId);

      if (volunteerIndex >= 0) {
        eventVolunteerFormArray.removeAt(volunteerIndex);
      }
    }
  }

  onSubmitVolunteerForActivityEvent() {
    if (!this.knightId) {
      return;
    }
    
    let knightId = this.knightId;
    let activityEventId = this.activityEvent?.activityEventId || 0;
    let volunteerSignUpRoles: number[] = [];

    for (let i = 0; i < this.volunteerSignUpRolesForm.length; i++) {
      const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(i) as FormGroup;
      const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as FormArray;
      let volunteerIndex = eventVolunteerFormArray.controls.findIndex(ctrl => ctrl.value.knightId === this.knightId);

      if (volunteerIndex >= 0) {
        let volunteerSignUpRoleId = volunteerSignUpRoleControl.value.volunteerSignUpRoleId as number;
        volunteerSignUpRoles.push(volunteerSignUpRoleId);
      }
    }

    let request = new VolunteerForActivityEventRequest({
      activityEventId: activityEventId,
      knightId: knightId,
      volunteerSignUpRoles: volunteerSignUpRoles
    });

    let activityEvent = this.mapFormToActivityEvent();

    let activityEventObserver = {
      next: (eventVolunteers: EventVolunteer[]) => this.passBack(activityEvent, eventVolunteers),
      error: (err: any) => this.logError('Error volunteering for Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateVolunteerForActivityEventSubscription = this.activityEventsService.volunteerForActivityEvent(request).subscribe(activityEventObserver);
  }

  private mapFormToActivityEvent() {
    let rawForm = this.volunteerForActivityEventForm.getRawValue();
      let volunteerRoles: VolunteerSignUpRole[] = rawForm?.volunteerSignUpRoles?.map(function(role: any) {
        return new VolunteerSignUpRole({
          volunteerSignupRoleId: role.volunteerSignUpRoleId,
          roleTitle: role.roleTitle,
          startDateTime: DateTimeFormatter.ToIso8601DateTime(role.startDate.year, role.startDate.month, role.startDate.day, role.startTime.hour, role.startTime.minute),
          endDateTime: DateTimeFormatter.ToIso8601DateTime(role.endDate.year, role.endDate.month, role.endDate.day, role.endTime.hour, role.endTime.minute),
          numberOfVolunteersNeeded: role.numberOfVolunteersNeeded,
          eventVolunteers: role.eventVolunteers.map(function(eventVolunteer: any) {
            return new EventVolunteer({
              eventVolunteerId: eventVolunteer.eventVolunteerId,
              knightId: eventVolunteer.knightId
            });
          })
        })
      });
      let locationAddress = new StreetAddress({
        streetAddressId: rawForm.locationAddress.streetAddressId,
        addressName: rawForm.locationAddress.addressName,
        address1: rawForm.locationAddress.address1,
        address2: rawForm.locationAddress.address2,
        city: rawForm.locationAddress.city,
        stateCode: rawForm.locationAddress.stateCode,
        postalCode: rawForm.locationAddress.postalCode,
        countryCode: rawForm.locationAddress.countryCode
      });
      let activityEvent = new ActivityEvent({
        activityEventId: rawForm.activityEventId,
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
      });

      return activityEvent;
  }

  private passBack(activityEvent: ActivityEvent, eventVolunteers: EventVolunteer[]) {
    if (activityEvent.volunteerSignUpRoles) {
      activityEvent.volunteerSignUpRoles.forEach((role) => {
        if (eventVolunteers.findIndex(ev => ev.volunteerSignUpRoleId === role.volunteerSignupRoleId) >= 0) {
          role.eventVolunteers.forEach((volunteer) => {
            if (volunteer.knightId === this.knightId) {
              let eventVolunteerId = eventVolunteers.filter(ev => ev.volunteerSignUpRoleId === role.volunteerSignupRoleId)[0].eventVolunteerId;
              volunteer.eventVolunteerId = eventVolunteerId;
            }
          });
        }
      });
    }

    let something = 5;

    this.activeModal.close(activityEvent);
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
