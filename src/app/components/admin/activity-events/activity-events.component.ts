import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { EditActivityEventModalComponent } from 'src/app/components/admin/activity-events/edit-activity-event-modal/edit-activity-event-modal.component';
import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { Address } from 'src/app/models/address';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';
import { AddressesService } from 'src/app/services/addresses.service';

import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { EditActivityEventLocationModalComponent } from './edit-activity-event-location-modal/edit-activity-event-location-modal.component';

@Component({
  selector: 'kofc-activity-events',
  templateUrl: './activity-events.component.html',
  styleUrls: ['./activity-events.component.css']
})
export class ActivityEventsComponent implements OnInit, OnDestroy {
  activityEventsSubscription?: Subscription;
  getAllAddressesForEventsSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  allAddresses: Address[] = [];
  // beginDate: Date = new Date();
  // endDate: Date = new Date();
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  page = 1;
  pageSize = 5;
  maxSize = 10;

  constructor(
    private activityEventsService: ActivityEventsService,
    private addressesService: AddressesService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'm', 6);
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getAllAddressesForEvents();
  }

  ngOnDestroy() {
    if (this.activityEventsSubscription) {
      this.activityEventsSubscription.unsubscribe();
    }

    if (this.getAllAddressesForEventsSubscription) {
      this.getAllAddressesForEventsSubscription.unsubscribe();
    }
  }

  getAllActivityEvents() {
    console.log(this.fromDate);
    console.log(this.toDate);

    let activityEventsObserver = {
      next: (activityEvents: ActivityEvent[]) => this.activityEvents = activityEvents,
      error: (err: any) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.')
    };

    if (this.fromDate?.year && 
      this.fromDate?.month && 
      this.fromDate?.day &&
      this.toDate?.year && 
      this.toDate?.month && 
      this.toDate?.day) {
        let beginDate = DateTimeFormatter.ToIso8601Date(this.fromDate.year, this.fromDate.month, this.fromDate.day);
        let endDate = DateTimeFormatter.ToIso8601Date(this.toDate.year, this.toDate.month, this.toDate.day);

        this.activityEventsSubscription = this.activityEventsService.getAllActivityEvents(beginDate, endDate).subscribe(activityEventsObserver);
      }
  }

  private getAllAddressesForEvents() {
    let addressesesObserver = {
      next: (getAllAddressesResponse: Address[]) => this.allAddresses = getAllAddressesResponse,
      error: (err: any) => this.logError('Error getting all addresses.', err),
      complete: () => console.log('All addresses loaded.')
    };

    this.getAllAddressesForEventsSubscription = this.addressesService.getAllAddressesForEvents().subscribe(addressesesObserver);
  }

  openEditActivityEventModal(activityEvent: ActivityEvent) {
    const modalRef = this.modalService.open(EditActivityEventModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activityEvent = activityEvent;
    modalRef.componentInstance.allAddresses = this.allAddresses;
    modalRef.componentInstance.modalHeaderText = 'Editing Activity Event';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result) => {
      if (result) {
        this.updateActivityEventInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Edit Activity Event Modal.', error);
      }
    });
  }

  private updateActivityEventInList(activityEvent: ActivityEvent) {
    let index = this.activityEvents?.findIndex(x => x.activityEventId === activityEvent.activityEventId)

    if (this.activityEvents && index !== undefined && index >= 0) {
      this.activityEvents[index] = activityEvent;
    }
  }

  openCreateActivityEventModal() {
    const modalRef = this.modalService.open(EditActivityEventModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.allAddresses = this.allAddresses;
    modalRef.componentInstance.modalHeaderText = 'Adding Activity Category';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: ActivityEvent) => {
      if (result) {
        this.activityEvents?.push(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Create Activity Event Modal.', error);
      }
    });
  }

  onDateSelection(date: NgbDate, datepicker: any) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      datepicker.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  openCreateAddressModal() {
    const modalRef = this.modalService.open(EditActivityEventLocationModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.modalHeaderText = 'Adding Event Location';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: Address) => {
      if (result) {
        this.allAddresses?.push(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Create Event Location Modal.', error);
      }
    });
  }

  openEditAddressModal(address: Address) {
    const modalRef = this.modalService.open(EditActivityEventLocationModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activityEvent = address;
    modalRef.componentInstance.modalHeaderText = 'Editing Event Location';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result: Address) => {
      if (result) {
        this.updateEventLocationInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Edit Event Location Modal.', error);
      }
    });
  }

  private updateEventLocationInList(address: Address) {
    let index = this.allAddresses.findIndex(x => x.addressId === address.addressId)

    if (this.allAddresses && index !== undefined && index >= 0) {
      this.allAddresses[index] = address;
    }
  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
