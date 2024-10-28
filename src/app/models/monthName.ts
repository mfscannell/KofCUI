export class MonthName {
  displayName: string = '';
  numberValue: number = 0;

  public constructor(fields?: { displayName?: string; numberValue?: number }) {
    if (fields) {
      this.displayName = fields.displayName || this.displayName;
      this.numberValue = fields.numberValue || this.numberValue;
    }
  }

  static January: MonthName = new MonthName({
    displayName: 'January',
    numberValue: 1,
  });

  static February: MonthName = new MonthName({
    displayName: 'February',
    numberValue: 2,
  });

  static March: MonthName = new MonthName({
    displayName: 'March',
    numberValue: 3,
  });

  static April: MonthName = new MonthName({
    displayName: 'April',
    numberValue: 4,
  });

  static May: MonthName = new MonthName({
    displayName: 'May',
    numberValue: 5,
  });

  static June: MonthName = new MonthName({
    displayName: 'June',
    numberValue: 6,
  });

  static July: MonthName = new MonthName({
    displayName: 'July',
    numberValue: 7,
  });

  static August: MonthName = new MonthName({
    displayName: 'August',
    numberValue: 8,
  });

  static September: MonthName = new MonthName({
    displayName: 'September',
    numberValue: 9,
  });

  static October: MonthName = new MonthName({
    displayName: 'October',
    numberValue: 10,
  });

  static November: MonthName = new MonthName({
    displayName: 'November',
    numberValue: 11,
  });

  static December: MonthName = new MonthName({
    displayName: 'December',
    numberValue: 12,
  });

  static AllMonths: MonthName[] = [
    MonthName.January,
    MonthName.February,
    MonthName.March,
    MonthName.April,
    MonthName.May,
    MonthName.June,
    MonthName.July,
    MonthName.August,
    MonthName.September,
    MonthName.October,
    MonthName.November,
    MonthName.December,
  ];
}
