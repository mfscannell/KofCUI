export class SendEmailRequest {
  activityId?: number = 0;
  subject: string = '';
  body: string = '';

  constructor(fields?: {
    activityId?: number,
    subject: string,
    body: string}) {
      if (fields) {
        this.activityId = fields.activityId || this.activityId;
        this.subject = fields.subject || this.subject;
        this.body = fields.body || this.body;
      }
  }
}