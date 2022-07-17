import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EncodedFile } from 'src/app/models/encodedFile';
import { UploadHomePageImageResponse } from 'src/app/models/responses/uploadHomePageImageResponse';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, OnDestroy {
  homePageImages: EncodedFile[] = [];
  showErrorMessage: boolean = false;
  errorMessages: string[] = [];
  showSuccessMessage: boolean = false;
  private uploadHomePageImageSubscription?: Subscription;

  constructor(public assetsService: AssetsService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.uploadHomePageImageSubscription) {
      this.uploadHomePageImageSubscription.unsubscribe();
    }
  }

  imageSource(image: EncodedFile) {
    let imgSrc = `data:${image.fileType};${image.encoding},${image.data}`;
    return imgSrc;
  }

  uploadFile(files: FileList | null) {
    console.log(files);
    //console.log(event.target.files[0]);

    //const formData = new FormData();

    if (files) {
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);

      let imageUploadObserver = {
        next: (response: EncodedFile) => this.handleUploadHomePageImageResponse(response),
        error: (err: any) => this.logError("Error Uploading image.", err),
        complete: () => console.log('Image uploaded.')
      };

      this.uploadHomePageImageSubscription = this.assetsService.uploadHomePageImage(formData).subscribe(imageUploadObserver);

      // for (const file of files) {
      //   formData.append(file.name, file);
      // }
    }
  }

  handleUploadHomePageImageResponse(response: EncodedFile) {
    //this.homePageImages.push(response);
    this.assetsService.appendHomePageCarouselImage(response);
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
    
    this.showErrorMessage = true;
  }
}
