export class Country {
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

    static UnitedStates: Country = new Country({
        displayName: 'United States',
        countryCode: 'US'
    });

    static AllCountries: Country[] = [
        Country.UnitedStates
    ];
}