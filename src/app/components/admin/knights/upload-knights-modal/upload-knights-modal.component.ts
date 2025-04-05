import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { Knight } from 'src/app/models/knight';
import { KnightsService } from 'src/app/services/knights.service';
import { ExcelFileReader } from 'src/app/services/excelFileReader.service';
import { Subscription } from 'rxjs';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { UploadFileEvent } from 'src/app/models/events/uploadFileEvent';
import { CreateKnightRequest } from 'src/app/models/requests/createKnightRequest';

@Component({
  selector: 'upload-knights-modal',
  templateUrl: './upload-knights-modal.component.html',
  styleUrls: ['./upload-knights-modal.component.scss'],
})
export class UploadKnightsModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() showModal: boolean = false;
  @Output() uploadKnightsChanges = new EventEmitter<Knight[]>();
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  uploadKnightsForm: UntypedFormGroup;
  filePath?: Blob;
  showExampleFile: boolean = false;
  toggleExampleFileText: string = 'Show Example File';
  createKnightsSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(private knightsService: KnightsService) {
    this.uploadKnightsForm = new UntypedFormGroup({});
  }

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
    this.showExampleFile = false;
    this.errorSaving = false;
    this.errorMessages = [];
  }

  public addFile(event: UploadFileEvent) {
    if (event.target?.files && event.target?.files.length) {
      const files = event.target?.files;
      this.filePath = files[0];
    }
  }

  onSubmitUploadKnights() {
    if (this.filePath) {
      ExcelFileReader.ReadKnightsFromFile(this.filePath)
        .then((knightsResult: CreateKnightRequest[]) => {
          console.log(knightsResult);
          this.createKnights(knightsResult);
        })
        .catch((error: ApiResponseError) => {
          this.logError('Error uploading knights from file.', error);
        });
    }
  }

  private createKnights(knights: CreateKnightRequest[]) {
    const knightsObserver = {
      next: (response: Knight[]) => this.passBackResponse(response),
      error: (err: ApiResponseError) => this.logError('Error Creating Knights.', err),
      complete: () => console.log('Knights created.'),
    };

    this.createKnightsSubscription = this.knightsService.createKnights(knights).subscribe(knightsObserver);
  }

  private passBackResponse(knights: Knight[]) {
    this.uploadKnightsChanges.emit(knights);
    this.createKnightsSubscription?.unsubscribe();
    this.showModal = false;
    this.closeModal?.nativeElement.click();
  }

  toggleExampleFile() {
    this.showExampleFile = !this.showExampleFile;
    this.toggleExampleFileText = this.showExampleFile ? 'Hide Example File' : 'Show Example File';
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach(error => {
        this.errorMessages.push(error);
      })
    }

    this.errorSaving = true;
  }
}
