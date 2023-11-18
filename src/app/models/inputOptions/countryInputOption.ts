export class CountryInputOption {
  displayName: string = '';
  countryCode: string = '';

  public constructor(
      fields?: {
          displayName? : string,
          countryCode?: string
  }) {
      if (fields) {
          this.displayName = fields.displayName || this.displayName;
          this.countryCode = fields.countryCode || this.countryCode;
      }
  }

  static UnitedStates: CountryInputOption = new CountryInputOption({
      displayName: 'United States',
      countryCode: 'US'
  });

  static AllCountries: CountryInputOption[] = [
    CountryInputOption.UnitedStates
  ];
}