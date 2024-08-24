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
import { SendEmailModalComponent } from './send-email-modal/send-email-modal.component';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'kofc-activity-events',
  templateUrl: './activity-events.component.html',
  styleUrls: ['./activity-events.component.scss']
})
export class ActivityEventsComponent implements OnInit, OnDestroy {
  activityEventsSubscription?: Subscription;
  getAllKnightsSubscription?: Subscription;
  getAllActivitiesSubscription?: Subscription;
  activityEvents: ActivityEvent[] = [];
  allActivities: Activity[] = [];
  allKnights: Knight[] = [];
  fromDate: string | undefined;
  toDate: string | undefined;
  page = 1;
  pageSize = 5;
  maxSize = 10;

  constructor(
    private activityEventsService: ActivityEventsService,
    private activitiesService: ActivitiesService,
    private knightsService: KnightsService,
    private permissionsService: PermissionsService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
      var initialDate = new Date();
      initialDate.setMonth(initialDate.getMonth() - 3);
      var finalDate = new Date(initialDate);
      finalDate.setMonth(finalDate.getMonth() + 6);
      this.fromDate = DateTimeFormatter.ToIso8601Date(initialDate.getFullYear(), initialDate.getMonth() + 1, initialDate.getDate());
      this.toDate = DateTimeFormatter.ToIso8601Date(finalDate.getFullYear(), finalDate.getMonth() + 1, finalDate.getDate());
      console.log("Exiting constructor");
      console.log(this.fromDate);
      console.log(this.toDate);
  }

  ngOnInit() {
    this.getAllActivityEvents();
    this.getAllActiveKnightsNames();
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

  formatDate(date: string | undefined) {
    return DateTimeFormatter.ToDisplayedDate(date);
  }

  canAddEvent() {
    return this.permissionsService.canAddEvent(this.allActivities);
  }

  canEditEvent(activityId: number) {
    return this.permissionsService.canEditEvent(activityId);
  }

  getAllActivityEvents() {
    console.log("getAllActivityEvents");
    console.log(this.fromDate);
    console.log(this.toDate);

    let activityEventsObserver = {
      next: (activityEvents: ActivityEvent[]) => this.activityEvents = activityEvents,
      error: (err: any) => this.logError('Error getting all activity events', err),
      complete: () => console.log('Activity Events loaded.')
    };

    if (this.fromDate && this.toDate) {
      this.activityEventsSubscription = this.activityEventsService.getAllActivityEvents(this.fromDate, this.toDate).subscribe(activityEventsObserver);
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

  private getAllActiveKnightsNames() {
    let knightsObserver = {
      next: (getAllKnightsResponse: Knight[]) => this.allKnights = getAllKnightsResponse,
      error: (err: any) => this.logError('Error getting all knights.', err),
      complete: () => console.log('All knights loaded.')
    };

    this.getAllKnightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
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
