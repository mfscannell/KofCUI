import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { ExcelFileReader } from 'src/app/services/excelFileReader.service';

@Component({
  selector: 'kofc-upload-knights-modal',
  templateUrl: './upload-knights-modal.component.html',
  styleUrls: ['./upload-knights-modal.component.css']
})
export class UploadKnightsModalComponent implements OnInit {
  @Input() modalHeaderText: string = '';
  uploadKnightsForm: FormGroup;
  filePath?: Blob;

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService
  ) {
    this.uploadKnightsForm = new FormGroup({});
  }

  ngOnInit() {
  }

  addFile(event: any) {
    this.filePath = event.target.files[0];
    let something = 5;
  }

  onSubmitUploadKnights() {
    if (this.filePath) {
      let knights = ExcelFileReader.ReadKnightsFromFile(this.filePath);
      let something = 5;
    }
  }

}
