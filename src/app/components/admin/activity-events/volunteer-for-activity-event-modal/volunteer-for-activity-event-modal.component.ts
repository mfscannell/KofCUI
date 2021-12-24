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
import { Address } from 'src/app/models/address';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { EventVolunteer } from 'src/app/models/eventVolunteer';
import { Knight } from 'src/app/models/knight';
import { VolunteerForActivityEventRequest } from 'src/app/models/requests/volunteerForActivityEventRequest';

@Component({
  selector: 'kofc-volunteer-for-activity-event-modal',
  templateUrl: './volunteer-for-activity-event-modal.component.html',
  styleUrls: ['./volunteer-for-activity-event-modal.component.css']
})
export class VolunteerForActivityEventModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() activityEvent?: ActivityEvent;
  @Input() allAddresses: Address[] = [];
  @Input() allKnights: Knight[] = [];
  knightId: number = 5; //TODO need to get this from log in.
  updateVolunteerForActivityEventSubscription?: Subscription;
  volunteerForActivityEventForm: FormGroup;
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private activityEventsService: ActivityEventsService) {
    var today = new Date();
    this.volunteerForActivityEventForm = new FormGroup({
      activityEventId: new FormControl(''),
      activityId: new FormControl(''),
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
        addressId: new FormControl(''),
        addressName: new FormControl(''),
        address1: new FormControl(''),
        address2: new FormControl(''),
        addressCity: new FormControl(''),
        addressStateCode: new FormControl(''),
        addressPostalCode: new FormControl(''),
        addressCountryCode: new FormControl('')
      }),
      showInCalendar: new FormControl(null),
      canceled: new FormControl({value: null, disabled: true}),
      canceledReason: new FormControl(''),
      volunteerSignUpRoles: new FormArray([])
     });
  }

  ngOnInit() {
    if (this.activityEvent) {
      this.volunteerForActivityEventForm.patchValue({
        activityEventId: this.activityEvent.activityEventId,
        activityId: this.activityEvent.activityId,
        eventName: this.activityEvent.eventName,
        eventDescription: this.activityEvent.eventDescription,
        startDate: {
          year: DateTimeFormatter.getYear(this.activityEvent.startDate),
          month: DateTimeFormatter.getMonth(this.activityEvent.startDate),
          day: DateTimeFormatter.getDay(this.activityEvent.startDate)
        },
        startTime: {
          hour: DateTimeFormatter.getHour(this.activityEvent.startTime),
          minute: DateTimeFormatter.getMinute(this.activityEvent.startTime)
        },
        endDate: {
          year: DateTimeFormatter.getYear(this.activityEvent.endDate),
          month: DateTimeFormatter.getMonth(this.activityEvent.startDate),
          day: DateTimeFormatter.getDay(this.activityEvent.startDate)
        },
        endTime: {
          hour: DateTimeFormatter.getHour(this.activityEvent.endTime),
          minute: DateTimeFormatter.getMinute(this.activityEvent.endTime)
        },
        locationAddress: {
          addressId: this.activityEvent.locationAddressId,
        },
        showInCalendar: this.activityEvent.showInCalendar,
        canceled: this.activityEvent.canceled,
        canceledReason: this.activityEvent.canceledReason
       });

       this.activityEvent.volunteerSignUpRoles?.forEach((role: VolunteerSignUpRole) => {
        const volunteerSignUpRole = new FormGroup({
          volunteerSignUpRoleId: new FormControl(role.volunteerSignupRoleId),
          roleTitle: new FormControl(role.roleTitle),
          startDate: new FormControl({
            year: DateTimeFormatter.getYear(role.startDate),
            month: DateTimeFormatter.getMonth(role.startDate),
            day: DateTimeFormatter.getDay(role.startDate)
          }),
          startTime: new FormControl({
            hour: DateTimeFormatter.getHour(role.startTime),
            minute: DateTimeFormatter.getMinute(role.startTime)
          }),
          endDate: new FormControl({
            year: DateTimeFormatter.getYear(role.endDate),
            month: DateTimeFormatter.getMonth(role.endDate),
            day: DateTimeFormatter.getDay(role.endDate)
          }),
          endTime: new FormControl({
            hour: DateTimeFormatter.getHour(role.endTime),
            minute: DateTimeFormatter.getMinute(role.endTime)
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

       if (this.allAddresses && this.allAddresses.length > 0) {
         let address = this.allAddresses.find(x => x.addressId === this.activityEvent?.locationAddressId);
        this.volunteerForActivityEventForm.patchValue({
          locationAddress: {
            addressName: address?.addressName,
            address1: address?.address1,
            address2: address?.address2,
            addressCity: address?.addressCity,
            addressStateCode: address?.addressStateCode,
            addressPostalCode: address?.addressPostalCode,
            addressCountryCode: address?.addressCountryCode
          }
        });
       }
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
          startDate: DateTimeFormatter.ToIso8601Date(role.startDate.year, role.startDate.month, role.startDate.day),
          startTime: DateTimeFormatter.ToIso8601Time(role.startTime.hour, role.startTime.minute),
          endDate: DateTimeFormatter.ToIso8601Date(role.endDate.year, role.endDate.month, role.endDate.day),
          endTime: DateTimeFormatter.ToIso8601Time(role.endTime.hour, role.endTime.minute),
          numberOfVolunteersNeeded: role.numberOfVolunteersNeeded,
          eventVolunteers: role.eventVolunteers.map(function(eventVolunteer: any) {
            return new EventVolunteer({
              eventVolunteerId: eventVolunteer.eventVolunteerId,
              knightId: eventVolunteer.knightId
            });
          })
        })
      });
      let activityEvent = new ActivityEvent({
        activityEventId: rawForm.activityEventId,
        activityId: rawForm.activityId,
        eventName: rawForm.eventName,
        eventDescription: rawForm.eventDescription,
        startDate: DateTimeFormatter.ToIso8601Date(rawForm.startDate.year, rawForm.startDate.month, rawForm.startDate.day),
        startTime: DateTimeFormatter.ToIso8601Time(rawForm.startTime.hour, rawForm.startTime.minute),
        endDate: DateTimeFormatter.ToIso8601Date(rawForm.endDate.year, rawForm.endDate.month, rawForm.endDate.day),
        endTime: DateTimeFormatter.ToIso8601Time(rawForm.endTime.hour, rawForm.endTime.minute),
        locationAddressId: rawForm.locationAddress.addressId,
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
