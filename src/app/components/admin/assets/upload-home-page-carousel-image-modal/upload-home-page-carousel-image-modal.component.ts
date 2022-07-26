import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { EncodedFile } from 'src/app/models/encodedFile';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-upload-home-page-carousel-image-modal',
  templateUrl: './upload-home-page-carousel-image-modal.component.html',
  styleUrls: ['./upload-home-page-carousel-image-modal.component.scss']
})
export class UploadHomePageCarouselImageModalComponent implements OnInit, OnDestroy {
  public modalHeaderText: string = 'Select an image to upload';
  public formData?: FormData;
  public uploadImageForm: UntypedFormGroup;
  private uploadHomePageImageSubscription?: Subscription;
  errorSaving: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private assetsService: AssetsService) {
      this.uploadImageForm = new UntypedFormGroup({});
    }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.uploadHomePageImageSubscription) {
      this.uploadHomePageImageSubscription.unsubscribe();
    }
  }

  selectFile(files: FileList | null) {
    console.log(files);

    if (files) {
      let fileToUpload = <File>files[0];
      this.formData = new FormData();
      this.formData.append('file', fileToUpload, fileToUpload.name);
    }
  }

  onSubmitUploadFile() {
    if (this.formData) {
      let imageUploadObserver = {
        next: (response: EncodedFile) => this.passBackResponse(response),
        error: (err: any) => this.logError("Error Uploading image.", err),
        complete: () => console.log('Image uploaded.')
      };
  
      this.uploadHomePageImageSubscription = this.assetsService.uploadHomePageImage(this.formData).subscribe(imageUploadObserver);
    }
  }

  private passBackResponse(response: EncodedFile) {
    this.activeModal.close(response);
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
