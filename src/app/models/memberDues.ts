export class MemberDues {
  year: number = 0;
  paidStatus: string = '';

  constructor(fields: {
    year: number,
    paidStatus: string
  }) {
    if (fields) {
      this.year = fields.year || this.year;
      this.paidStatus = fields.paidStatus || this.paidStatus;
    }
  }
}