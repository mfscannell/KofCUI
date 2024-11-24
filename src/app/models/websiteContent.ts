import { EncodedFile } from "./encodedFile";
import { ExternalLink } from "./externalLink";

export interface WebsiteContent {
  homePageCarouselImages: EncodedFile[];
  facebookUrl: string;
  twitterUrl: string;
  councilTimeZone: string;
  externalLinks: ExternalLink[];
}