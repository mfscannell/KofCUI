import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-configs-result-modal',
  templateUrl: './update-configs-result-modal.component.html',
  styleUrls: ['./update-configs-result-modal.component.scss']
})
export class UpdateConfigsResultModalComponent implements OnInit {
  @Input() success: boolean = true;
  @Input() errorMessages: string[] = [];
  modalHeaderText: string = '';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
