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

@Component({
  selector: 'kofc-edit-activity-event-modal',
  templateUrl: './edit-activity-event-modal.component.html',
  styleUrls: ['./edit-activity-event-modal.component.css']
})
export class EditActivityEventModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() activityEvent?: ActivityEvent;
  @Input() allAddresses: Address[] = [];
  @Input() allKnights: Knight[] = [];
  @Input() allActivities: Activity[] = [];
  updateActivityEventSubscription?: Subscription;
  createActivityEventSubscription?: Subscription;
  editActivityEventForm: FormGroup;
  allVolunteerRoles: VolunteerSignUpRole[] = [];
  countries: Country[] = Country.AllCountries;
  states: AddressState[] = AddressState.AllStates;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private activityEventsService: ActivityEventsService) {
      var today = new Date();
      this.editActivityEventForm = new FormGroup({
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
        canceled: new FormControl(null),
        canceledReason: new FormControl(''),
        volunteerSignUpRoles: new FormArray([])
       });
    }

  ngOnInit() {
    if (this.activityEvent) {
      this.editActivityEventForm.patchValue({
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
          eventVolunteers: new FormArray(this.initEventVolunteersForm(role.eventVolunteers))
        });
    
        this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
       });

       if (this.allAddresses && this.allAddresses.length > 0) {
         let address = this.allAddresses.find(x => x.addressId === this.activityEvent?.locationAddressId);
        this.editActivityEventForm.patchValue({
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

  initEventVolunteersForm(eventVolunteers: EventVolunteer[] | undefined) {
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

  ngOnDestroy() {
    if (this.createActivityEventSubscription) {
      this.createActivityEventSubscription.unsubscribe();
    }

    if (this.updateActivityEventSubscription) {
      this.updateActivityEventSubscription.unsubscribe();
    }
  }

  changeLocationAddress($event: any) {
    let newAddressId = Number($event.target.value);
    let newAddress = this.allAddresses.find(x => x.addressId === newAddressId);
    this.editActivityEventForm.patchValue({
      locationAddress: {
        addressId: newAddress?.addressId,
        addressName: newAddress?.addressName,
        address1: newAddress?.address1,
        address2: newAddress?.address2,
        addressCity: newAddress?.addressCity,
        addressStateCode: newAddress?.addressStateCode,
        addressPostalCode: newAddress?.addressPostalCode,
        addressCountryCode: newAddress?.addressCountryCode
      }
    });
  }

  onChangeShowInCalendar(isChecked: boolean) {
  }

  onChangeActivity(event: any) {
    console.log(event);
    let eventNameIndex = this.allActivities.findIndex(x => x.activityId == event.target.value);

    if (eventNameIndex >= 0) {
      let eventName = this.allActivities[eventNameIndex].activityName;
      this.editActivityEventForm.controls["eventName"].setValue(eventName);
    }
  }

  onChangeEventStartDate(event: any) {
    this.editActivityEventForm.patchValue({
      endDate: {
        year: event.year,
        month: event.month,
        day: event.day
      }
    });

    this.volunteerSignUpRolesForm.controls.forEach(vsurControl => function(vsurControl: FormGroup) {
      vsurControl.patchValue({
        startDate: {
          year: event.year,
          month: event.month,
          day: event.day
        },
        endDate: {
          year: event.year,
          month: event.month,
          day: event.day
        }
      });
    });
  }

  onChangeEventStartTime(event: any) {
    this.editActivityEventForm.patchValue({
      endTime: {
        hour: event.hour + 1,
        minute: event.minute
      }
    });

    this.volunteerSignUpRolesForm.controls.forEach(vsurControl => function(vsurControl: FormGroup) {
      vsurControl.patchValue({
        startTime: {
          hour: event.hour,
          minute: event.minute
        },
        endTime: {
          hour: event.hour + 1,
          minute: event.minute,
        }
      });
    });
  }

  onChangeEventEndTime(event: any) {
    //TODO need to limit end time to one hour past start time
    this.volunteerSignUpRolesForm.controls.forEach(vsurControl => function(vsurControl: FormGroup) {
      vsurControl.patchValue({
        endTime: {
          hour: event.hour,
          minute: event.minute,
        }
      });
    });
  }

  onChangeVolunteerRoleStartTime(event: any, index: number) {
    this.volunteerSignUpRolesForm.at(index).patchValue({
      endTime: {
        hour: event.hour,
        minute: event.minute
      }
    })
  }

  onChangeVolunteerRoleEndTime(event: any, index: number) {
    let something = 5;

    //TODO need to limit end time to be after start time.
  }

  getEventVolunteers(volunteerSignUpRole: AbstractControl) {
    const something = volunteerSignUpRole as FormGroup;
    const eventVolunteers = something.controls["eventVolunteers"] as FormArray;

    return eventVolunteers.controls;
  }

  get volunteerSignUpRolesForm() {
    return this.editActivityEventForm.controls["volunteerSignUpRoles"] as FormArray;
  }

  private getEventStartDate() {
    let formControl = this.editActivityEventForm.controls["startDate"] as FormControl;

    return formControl.value;
  }

  private getEventStartTime() {
    let formControl = this.editActivityEventForm.controls["startTime"] as FormControl;

    return formControl.value;
  }

  private getEventEndDate() {
    let formControl = this.editActivityEventForm.controls["endDate"] as FormControl;

    return formControl.value;
  }

  private getEventEndTime() {
    let formControl = this.editActivityEventForm.controls["endTime"] as FormControl;

    return formControl.value;
  }

  addVolunteerSignUpRole() {
    const volunteerSignUpRole = new FormGroup({
      volunteerSignUpRoleId: new FormControl(''),
      roleTitle: new FormControl(''),
      startDate: new FormControl(this.getEventStartDate()),
      startTime: new FormControl({
        "hour": this.getEventStartTime().hour,
        "minute": this.getEventStartTime().minute
      }),
      endDate: new FormControl(this.getEventEndDate()),
      endTime: new FormControl({
        "hour": this.getEventEndTime().hour,
        "minute": this.getEventEndTime().minute
      }),
      numberOfVolunteersNeeded: new FormControl(''),
      eventVolunteers: new FormArray([])
    });

    this.volunteerSignUpRolesForm.push(volunteerSignUpRole);
  }

  deleteVolunteerSignUpRole(roleIndex: number) {
    this.volunteerSignUpRolesForm.removeAt(roleIndex);
  }

  addEventVolunteer(volunteerSignUpRoleIndex: number) {
    const eventVolunteerFormGroup = new FormGroup({
      eventVolunteerId: new FormControl(''),
      knightId: new FormControl('')
    })

    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(volunteerSignUpRoleIndex) as FormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as FormArray;
    eventVolunteerFormArray.push(eventVolunteerFormGroup);
  }

  deleteEventVolunteer(roleIndex: number, volunteerIndex: number) {
    const volunteerSignUpRoleControl = this.volunteerSignUpRolesForm.at(roleIndex) as FormGroup;
    const eventVolunteerFormArray = volunteerSignUpRoleControl.controls["eventVolunteers"] as FormArray;
    eventVolunteerFormArray.removeAt(volunteerIndex);
  }

  onSubmitEditActivityEvent() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updateActivityEventRequest = this.mapFormToActivityEvent();
      
      this.updateActivityEvent(updateActivityEventRequest);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let createActivityEventRequest = this.mapFormToActivityEvent();

      this.createActivityEvent(createActivityEventRequest);
    }
  }

  private mapFormToActivityEvent() {
    let rawForm = this.editActivityEventForm.getRawValue();
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

  private createActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (createdActivityEvent: ActivityEvent) => this.passBack(createdActivityEvent),
      error: (err: any) => this.logError('Error creating Activity Event', err),
      complete: () => console.log('Activity Event created.')
    };

    this.createActivityEventSubscription = this.activityEventsService.createActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private updateActivityEvent(activityEvent: ActivityEvent) {
    let activityEventObserver = {
      next: (activityEvent: ActivityEvent) => this.passBack(activityEvent),
      error: (err: any) => this.logError('Error updating Activity Event', err),
      complete: () => console.log('Activity Event updated.')
    };

    this.updateActivityEventSubscription = this.activityEventsService.updateActivityEvent(activityEvent).subscribe(activityEventObserver);
  }

  private passBack(activityEvent: ActivityEvent) {
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
