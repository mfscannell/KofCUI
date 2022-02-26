export class ExternalLink {
  websiteName: string = '';
  url: string = '';

  public constructor(
      fields?: {
          websiteName? : string,
          url?: string
  }) {
      if (fields) {
          this.websiteName = fields.websiteName || this.websiteName;
          this.url = fields.url || this.url;
      }
  }
}