import { Component, OnInit } from '@angular/core';
import { EncodedFile } from 'src/app/models/encodedFile';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor(public assetsService: AssetsService) { }

  ngOnInit() {
  }

  imageSource(image: EncodedFile) {
    const imgSrc = `data:${image.fileType};${image.encoding},${image.data}`;
    return imgSrc;
  }
}
