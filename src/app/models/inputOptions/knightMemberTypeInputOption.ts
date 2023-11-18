import { KnightMemberTypeEnums } from "src/app/enums/knightMemberTypeEnums";

export class KnightMemberTypeInputOption {
  static options: KnightMemberTypeInputOption[] = [
    new KnightMemberTypeInputOption({
      displayName: 'Associate',
      value: 'Associate'
    }),
    new KnightMemberTypeInputOption({
      displayName: 'Insurance',
      value: 'Insurance'
    })
  ];

  displayName: string = '';
  value: string = 'Associate';

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