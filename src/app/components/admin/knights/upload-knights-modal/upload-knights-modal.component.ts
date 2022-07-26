import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { ExcelFileReader } from 'src/app/services/excelFileReader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kofc-upload-knights-modal',
  templateUrl: './upload-knights-modal.component.html',
  styleUrls: ['./upload-knights-modal.component.scss']
})
export class UploadKnightsModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  uploadKnightsForm: UntypedFormGroup;
  filePath?: Blob;
  showExampleFile: boolean = false;
  toggleExampleFileText: string = "Show Example File";
  createKnightsSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private knightsService: KnightsService
  ) {
    this.uploadKnightsForm = new UntypedFormGroup({});
  }

  ngOnInit() {
  }

  ngOnDestroy() {
      if (this.createKnightsSubscription) {
        this.createKnightsSubscription.unsubscribe();
      }
  }

  addFile(event: any) {
    this.filePath = event.target.files[0];
  }

  onSubmitUploadKnights() {
    if (this.filePath) {
      ExcelFileReader.ReadKnightsFromFile(this.filePath).then((knightsResult: Knight[]) => {
        console.log(knightsResult);
        this.createKnights(knightsResult);
      }).catch((error: any) => {
        this.logError("Error uploading knights from file.", error)
      });
    }
  }

  private createKnights(knights: Knight[]) {
    let knightsObserver = {
      next: (response: Knight[]) => this.passBackResponse(response),
      error: (err: any) => this.logError("Error Creating Knights.", err),
      complete: () => console.log('Knights created.')
    };

    this.createKnightsSubscription = this.knightsService.createKnights(knights).subscribe(knightsObserver);
  }

  private passBackResponse(knights: Knight[]) {
    this.activeModal.close(knights);
  }

  toggleExampleFile() {
    this.showExampleFile = !this.showExampleFile;
    this.toggleExampleFileText = this.showExampleFile ? "Hide Example File" : "Show Example File";
  }

  logError(message: string, err: any) {
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
