import { MemberDuesPaymentStatus } from "../enums/memberDuesPaymentStatus";

export class MemberDues {
  memberDuesId: number = 0;
  year: number = 0;
  paidStatus: MemberDuesPaymentStatus = MemberDuesPaymentStatus.Unpaid;

  constructor(fields: {
    memberDuesId: number,
    year: number,
    paidStatus: MemberDuesPaymentStatus
  }) {
    if (fields) {
      this.memberDuesId = fields.memberDuesId || this.memberDuesId;
      this.year = fields.year || this.year;
      this.paidStatus = fields.paidStatus || this.paidStatus;
    }
  }
}