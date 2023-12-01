import { KnightDegree } from "src/app/types/knight-degree.type";

export class KnightDegreeInputOption {
  static options: KnightDegreeInputOption[] = [
    new KnightDegreeInputOption({
      displayName: 'First',
      value: 'First'
    }),
    new KnightDegreeInputOption({
      displayName: 'Second',
      value: 'Second'
    }),
    new KnightDegreeInputOption({
      displayName: 'Third',
      value: 'Third'
    }),
    new KnightDegreeInputOption({
      displayName: 'Fourth',
      value: 'Fourth'
    })
  ];

  displayName: string = '';
  value: KnightDegree = 'First';

  constructor(fields: {
    displayName: string,
    value: KnightDegree
  }) {
    if (fields) {
      this.displayName = fields.displayName;
      this.value = fields.value;
    }
  }
}