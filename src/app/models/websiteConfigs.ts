import { ExternalLink } from "./externalLink";

export class WebsiteConfigs {
  externalLinks: ExternalLink[] = [];
  facebookUrl?: string;
  twitterUrl?: string;

  constructor(fields: {
    externalLinks: ExternalLink[],
    facebookUrl?: string,
    twitterUrl?: string
  }) {
    if (fields) {
      this.externalLinks = fields.externalLinks || this.externalLinks;
      this.facebookUrl = fields.facebookUrl || this.facebookUrl;
      this.twitterUrl = fields.twitterUrl || this.twitterUrl;
    }
  }
}