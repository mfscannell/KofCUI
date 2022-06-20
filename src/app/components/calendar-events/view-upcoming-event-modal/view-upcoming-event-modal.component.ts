import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpcomingEvent } from 'src/app/models/upcomingEvent';
import { DateTimeFormatter } from 'src/app/utilities/dateTimeFormatter';

@Component({
  selector: 'kofc-view-upcoming-event-modal',
  templateUrl: './view-upcoming-event-modal.component.html',
  styleUrls: ['./view-upcoming-event-modal.component.scss']
})
export class ViewUpcomingEventModalComponent implements OnInit {
  @Input() modalHeaderText: string = '';
  @Input() upcomingEvents: UpcomingEvent[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (this.upcomingEvents) {
    }
  }

  formatTime(dateTime: string | undefined) {
    return DateTimeFormatter.ToDisplayTime(dateTime);
  }

}
