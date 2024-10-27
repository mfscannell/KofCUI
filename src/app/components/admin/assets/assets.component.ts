import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EncodedFile } from 'src/app/models/encodedFile';
import { AssetsService } from 'src/app/services/assets.service';
import { UntypedFormGroup } from '@angular/forms';
import { DeleteHomePageCarouselImageResponse } from 'src/app/models/responses/deleteHomePageCarouselImageResponse';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, OnDestroy {
  showErrorMessage: boolean = false;
  errorMessages: string[] = [];
  showSuccessMessage: boolean = false;
  private uploadHomePageImageSubscription?: Subscription;
  public formData?: FormData;
  public uploadImageForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  @ViewChild('cancelEditActiveModal', {static: false}) cancelEditActiveModal: ElementRef | undefined;
  @ViewChild('cancelEditActiveModal', {static: false}) cancelDeleteActiveModal: ElementRef | undefined;

  deleteImageForm: UntypedFormGroup;
  fileNameToDelete: string = '';
  indexToDelete: number = -1;
  private deleteHomePageImageSubscription?: Subscription;

  constructor(
    public assetsService: AssetsService) {
      this.uploadImageForm = new UntypedFormGroup({});
      this.deleteImageForm = new UntypedFormGroup({});
    }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.uploadHomePageImageSubscription) {
      this.uploadHomePageImageSubscription.unsubscribe();
    }

    if (this.deleteHomePageImageSubscription) {
      this.deleteHomePageImageSubscription.unsubscribe();
    }
  }

  imageSource(image: EncodedFile) {
    const imgSrc = `data:${image.fileType};${image.encoding},${image.data}`;
    return imgSrc;
  }

  openUploadHomePageCarouselImageModal() {
  }

  selectFile(files: FileList | null) {
    console.log(files);

    if (files) {
      const fileToUpload = <File>files[0];
      this.formData = new FormData();
      this.formData.append('file', fileToUpload, fileToUpload.name);
    }
  }

  onSubmitUploadFile() {
    if (this.formData) {
      const imageUploadObserver = {
        next: (response: EncodedFile) => this.handleUploadHomePageImageResponse(response),
        error: (err: ApiResponseError) => this.logError("Error Uploading image.", err),
        complete: () => console.log('Image uploaded.')
      };
  
      this.uploadHomePageImageSubscription = this.assetsService.uploadHomePageImage(this.formData).subscribe(imageUploadObserver);
    }
  }

  private handleUploadHomePageImageResponse(response: EncodedFile) {
    this.showErrorMessage = false;
    this.errorMessages = [];
    this.assetsService.appendHomePageCarouselImage(response);
    this.cancelEditActiveModal?.nativeElement.click();
  }

  openConfirmDeleteHomePageCarouselImage(index: number) {
    this.indexToDelete = index;
    const homePageImage = this.assetsService.getHomePageCarouselImages()[index];
    this.fileNameToDelete = homePageImage.fileName;
  }

  onSubmitDeleteFile() {
    if (this.fileNameToDelete) {
      const imageUploadObserver = {
        next: (response: DeleteHomePageCarouselImageResponse) => this.handleDeleteImageSuccess(response),
        error: (err: ApiResponseError) => this.logError("Error Deleting image.", err),
        complete: () => console.log('Image deleted.')
      };
  
      this.deleteHomePageImageSubscription = this.assetsService.deleteHomePageCarouselImage(this.fileNameToDelete).subscribe(imageUploadObserver);
    }
  }

  private handleDeleteImageSuccess(response: DeleteHomePageCarouselImageResponse) {
    console.log(response);
    this.assetsService.removeHomePageCarouselImage(this.indexToDelete);
    this.cancelDeleteActiveModal?.nativeElement.click();
  }

  logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.showErrorMessage = true;
  }
}
