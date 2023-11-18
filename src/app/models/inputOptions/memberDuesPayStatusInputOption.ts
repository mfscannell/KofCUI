export class MemberDuesPayStatusInputOption {
  static options: MemberDuesPayStatusInputOption[] = [
    new MemberDuesPayStatusInputOption({
      displayName: 'Unpaid',
      value: 'Unpaid'
    }),
    new MemberDuesPayStatusInputOption({
      displayName: 'Paid',
      value: 'Paid'
    }),
    new MemberDuesPayStatusInputOption({
      displayName: 'Honorary Life',
      value: 'HonoraryLife'
    })
  ];

  displayName: string = '';
  value: string = '';

  constructor(fields: {
    displayName: string,
    value: string
  }) {
    if (fields) {
      this.displayName = fields.displayName;
      this.value = fields.value;
    }
  }
}