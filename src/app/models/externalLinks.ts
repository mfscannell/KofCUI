import { ExternalLink } from 'src/app/models/externalLink';

export class ExternalLinks {
  displayExternalLinks: boolean = false;
  externalLinks: ExternalLink[] = [];

  public constructor(
      fields?: {
        displayExternalLinks : boolean,
        externalLinks?: ExternalLink[]
  }) {
      if (fields) {
          this.displayExternalLinks = fields.displayExternalLinks || this.displayExternalLinks;
          this.externalLinks = fields.externalLinks || this.externalLinks;
      }
  }
}