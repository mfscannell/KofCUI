import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpcomingEvent } from 'src/app/models/upcomingEvent';

@Component({
  selector: 'kofc-view-upcoming-event-modal',
  templateUrl: './view-upcoming-event-modal.component.html',
  styleUrls: ['./view-upcoming-event-modal.component.css']
})
export class ViewUpcomingEventModalComponent implements OnInit {
  @Input() modalHeaderText: string = '';
  @Input() upcomingEvents: UpcomingEvent[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (this.upcomingEvents) {
    }
  }

}