export class ActivityEventNotes {
  startDateTime: string = '';
  notes: string = '';

  constructor(fields: {
    startDateTime: string,
    notes: string
  }) {
    if (fields) {
      this.startDateTime = fields.startDateTime || this.startDateTime;
      this.notes = fields.notes || this.notes;
    }
  }
}