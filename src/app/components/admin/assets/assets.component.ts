import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EncodedFile } from 'src/app/models/encodedFile';
import { AssetsService } from 'src/app/services/assets.service';
import { UntypedFormGroup } from '@angular/forms';
import { DeleteHomePageCarouselImageResponse } from 'src/app/models/responses/deleteHomePageCarouselImageResponse';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { WebsiteContent } from 'src/app/models/websiteContent';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit, OnDestroy {
  showErrorMessage: boolean = false;
  errorMessages: string[] = [];
  showSuccessMessage: boolean = false;
  private uploadHomePageImageSubscription?: Subscription;
  private getWebsiteContentSubscription?: Subscription;
  public formData?: FormData;
  public uploadImageForm: UntypedFormGroup;
  public errorSaving: boolean = false;
  public homePageCarouselImages: EncodedFile[] = [];
  public homePageCarouselImageSources: string[] = [];
  @ViewChild('cancelEditActiveModal', { static: false }) cancelEditActiveModal: ElementRef | undefined;
  @ViewChild('cancelEditActiveModal', { static: false })
  cancelDeleteActiveModal: ElementRef | undefined;

  deleteImageForm: UntypedFormGroup;
  fileNameToDelete: string = '';
  indexToDelete: number = -1;
  private deleteHomePageImageSubscription?: Subscription;

  constructor(public assetsService: AssetsService, private configsService: ConfigsService) {
    this.uploadImageForm = new UntypedFormGroup({});
    this.deleteImageForm = new UntypedFormGroup({});
  }

  ngOnInit() {
    this.getWebsiteContent();
  }

  ngOnDestroy(): void {
    if (this.uploadHomePageImageSubscription) {
      this.uploadHomePageImageSubscription.unsubscribe();
    }

    if (this.deleteHomePageImageSubscription) {
      this.deleteHomePageImageSubscription.unsubscribe();
    }

    if (this.getWebsiteContentSubscription) {
      this.getWebsiteContentSubscription.unsubscribe();
    }
  }

  imageSource(image: EncodedFile) {
    const imgSrc = `data:${image.fileType};${image.encoding},${image.data}`;
    return imgSrc;
  }

  openUploadHomePageCarouselImageModal() {}

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
        error: (err: ApiResponseError) => this.logError('Error Uploading image.', err),
        complete: () => console.log('Image uploaded.'),
      };

      this.uploadHomePageImageSubscription = this.assetsService
        .uploadHomePageImage(this.formData)
        .subscribe(imageUploadObserver);
    }
  }

  private getWebsiteContent() {
    const observer = {
      next: (websiteContent: WebsiteContent) => { 
        this.homePageCarouselImages = websiteContent.homePageCarouselImages;
        this.homePageCarouselImageSources = websiteContent.homePageCarouselImages.map((image) => {
          return `data:${image.fileType};${image.encoding},${image.data}`;
        });
      },
      error: (err: ApiResponseError) => this.logError('Menu Error getting website content', err),
      complete: () => console.log('Webstie content retrieved.'),
    };

    this.getWebsiteContentSubscription = this.configsService.getWebsiteContent().subscribe(observer);
  }

  private handleUploadHomePageImageResponse(response: EncodedFile) {
    this.showErrorMessage = false;
    this.errorMessages = [];
    this.configsService.flagWebsiteContentStale();
    this.homePageCarouselImages.push(response);
    this.homePageCarouselImageSources.push(`data:${response.fileType};${response.encoding},${response.data}`);
    this.cancelEditActiveModal?.nativeElement.click();
  }

  public openConfirmDeleteHomePageCarouselImage(index: number) {
    this.indexToDelete = index;
    const homePageImage = this.homePageCarouselImages[index];
    this.fileNameToDelete = homePageImage.fileName;
  }

  onSubmitDeleteFile() {
    if (this.fileNameToDelete) {
      const imageUploadObserver = {
        next: (response: DeleteHomePageCarouselImageResponse) => this.handleDeleteImageSuccess(response),
        error: (err: ApiResponseError) => this.logError('Error Deleting image.', err),
        complete: () => console.log('Image deleted.'),
      };

      this.deleteHomePageImageSubscription = this.assetsService
        .deleteHomePageCarouselImage(this.fileNameToDelete)
        .subscribe(imageUploadObserver);
    }
  }

  private handleDeleteImageSuccess(response: DeleteHomePageCarouselImageResponse) {
    console.log(response);
    this.configsService.flagWebsiteContentStale();
    this.homePageCarouselImages.splice(this.indexToDelete, 1);
    this.homePageCarouselImageSources.splice(this.indexToDelete, 1);
    this.cancelDeleteActiveModal?.nativeElement.click();
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
