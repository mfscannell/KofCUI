export class ActivityCategoryInputOption {
  static options: ActivityCategoryInputOption[] = [
    new ActivityCategoryInputOption({
      displayName: 'Community',
      value: 'Community'
    }),
    new ActivityCategoryInputOption({
      displayName: 'Faith',
      value: 'Faith'
    }),
    new ActivityCategoryInputOption({
      displayName: 'Family',
      value: 'Family'
    }),
    new ActivityCategoryInputOption({
      displayName: 'Life',
      value: 'Life'
    }),
    new ActivityCategoryInputOption({
      displayName: 'Miscellaneous',
      value: 'Miscellaneous'
    })
  ];

  displayName: string = '';
  value: string = 'Community';

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