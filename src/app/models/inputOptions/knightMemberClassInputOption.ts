import { KnightMemberClassEnums } from "src/app/enums/knightMemberClassEnums";

export class KnightMemberClassInputOption {
  static options: KnightMemberClassInputOption[] = [
    new KnightMemberClassInputOption({
      displayName: 'Paying',
      value: 'Paying'
    }),
    new KnightMemberClassInputOption({
      displayName: 'Honorary Life',
      value: 'HonoraryLife'
    })
  ];

  displayName: string = '';
  value: string = 'Paying';

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