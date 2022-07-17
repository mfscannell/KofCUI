import { EncodedFile } from "../encodedFile";
import { ExternalLink } from "../externalLink";

export class GetAllWebsiteContentResponse {
  homePageCarouselImages: EncodedFile[] = [];

  constructor(fields: {
    homePageCarouselImages: EncodedFile[]
  }) {
    if (fields) {
      this.homePageCarouselImages = fields.homePageCarouselImages || this.homePageCarouselImages;
    }
  }
}