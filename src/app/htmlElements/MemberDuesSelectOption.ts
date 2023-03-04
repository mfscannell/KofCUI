import {MemberDuesPaymentStatus} from 'src/app/enums/memberDuesPaymentStatus';

export class MemberDuesSelectOption {
    public value: MemberDuesPaymentStatus = MemberDuesPaymentStatus.Unpaid;
    public displayName: string = '';

    static Unpaid = new MemberDuesSelectOption({
        value: MemberDuesPaymentStatus.Unpaid,
        displayName: 'Unpaid'
    });
    static Paid = new MemberDuesSelectOption({
      value: MemberDuesPaymentStatus.Paid,
      displayName: 'Paid'
  });
    static HonoraryLife = new MemberDuesSelectOption({
        value: MemberDuesPaymentStatus.HonoraryLife,
        displayName: 'Honorary Life'
    });
    static AllOptions: MemberDuesSelectOption[] = [
        MemberDuesSelectOption.Unpaid,
        MemberDuesSelectOption.Paid,
        MemberDuesSelectOption.HonoraryLife
    ];

    constructor(fields: {
        value: MemberDuesPaymentStatus, 
        displayName: string}) {
            if (fields) {
                this.value = fields.value || this.value;
                this.displayName = fields.displayName || this.displayName;
            }
    }
}