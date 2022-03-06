export class StringDropDownOption {
  id: string = '';
  displayName: string = '';

  constructor(fields?: {
    id: string,
    displayName: string
  }) {
    if (fields) {
      this.id = fields.id || this.id;
      this.displayName = fields.displayName || this.displayName;
    }
  }
}