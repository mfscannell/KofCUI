import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { EditActivityEventModalComponent } from 'src/app/components/admin/activity-events/edit-activity-event-modal/edit-activity-event-modal.component';
import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { ActivityEvent } from 'src/app/models/activityEvent';
import { ActivityEventsService } from 'src/app/services/activityEvents.service';

import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';
import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { Activity } from 'src/app/models/activity';
import { ActivitiesService } from 'src/app/services/activities.service';
import { VolunteerForActivityEventModalComponent } from './volunteer-for-activity-event-modal/volunteer-for-activity-event-modal.component';
import { SendEmailModalComponent } from './send-email-modal/send-email-modal.component';

@Component({
  selector: 'kofc-activity-events',
  templateUrl: './activity-events.component.html',
  styleUrls: ['./activity-events.component.css']
})
export class ActivityEventsComponent implements OnInit, OnDestroy {
  activityEventsSubscription?: Subscription;
  getAllKnightsSubscription?: Subscription;
  getAllActivitiesSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  allActivities: Activity[] = [];
  allKnights: Knight[] = [];
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
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'm', 6);
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getAllKnights();
    this.getAllActivities();
  }

  ngOnDestroy() {
    if (this.activityEventsSubscription) {
      this.activityEventsSubscription.unsubscribe();
    }

    if (this.getAllKnightsSubscription) {
      this.getAllKnightsSubscription.unsubscribe();
    }

    if (this.getAllActivitiesSubscription) {
      this.getAllActivitiesSubscription.unsubscribe();
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

  private getAllActivities() {
    let activitiesObserver = {
      next: (getAllActivitiesResponse: Activity[]) => this.allActivities = getAllActivitiesResponse.sort((a, b)=> a.activityName.localeCompare(b.activityName)),
      error: (err: any) => this.logError('Error getting all activities', err),
      complete: () => console.log('All activities loaded.')
    };
    this.getAllActivitiesSubscription = this.activitiesService.getAllActivities().subscribe(activitiesObserver);
  }

  private getAllKnights() {
    let knightsObserver = {
      next: (getAllKnightsResponse: Knight[]) => this.allKnights = getAllKnightsResponse,
      error: (err: any) => this.logError('Error getting all knights.', err),
      complete: () => console.log('All knights loaded.')
    };

    this.getAllKnightsSubscription = this.knightsService.getAllKnights().subscribe(knightsObserver);
  }

  openEditActivityEventModal(activityEvent: ActivityEvent) {
    const modalRef = this.modalService.open(EditActivityEventModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activityEvent = activityEvent;
    modalRef.componentInstance.allActivities = this.allActivities;
    modalRef.componentInstance.allKnights = this.allKnights;
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

  openSendEmailModal(activityEvent: ActivityEvent) {
    const modalRef = this.modalService.open(SendEmailModalComponent, {size: 'xl', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activityEvent = activityEvent;
    modalRef.componentInstance.modalHeaderText = 'Send Email For Activity Event';

    modalRef.result.then((result) => {
      if (result) {
        this.showEmailSentMessage();
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Send Email for Activity Event Modal.', error);
      }
    });
  }

  openVolunteerForActivityEventModal(activityEvent: ActivityEvent) {
    const modalRef = this.modalService.open(VolunteerForActivityEventModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.activityEvent = activityEvent;
    modalRef.componentInstance.allKnights = this.allKnights;
    modalRef.componentInstance.modalHeaderText = 'Volunteer For Activity Event';
    modalRef.result.then((result) => {
      if (result) {
        this.updateActivityEventInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        this.logError('Error from Volunteer For Activity Event Modal.', error);
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

    modalRef.componentInstance.allActivities = this.allActivities;
    modalRef.componentInstance.allKnights = this.allKnights;
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

  private showEmailSentMessage() {

  }

  logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
