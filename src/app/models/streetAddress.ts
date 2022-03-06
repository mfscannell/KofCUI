export class StreetAddress {
    streetAddressId?: number;
    addressName: string = "";
    address1: string = "";
    address2: string = "";
    city: string = "";
    stateCode: string = "";
    postalCode: string = "";
    countryCode: string = "";

    public constructor(
        fields?: {
            streetAddressId? : number,
            addressName? : string,
            address1: string,
            address2: string,
            city: string,
            stateCode: string,
            postalCode: string,
            countryCode: string
    }) {
        if (fields) {
            this.streetAddressId = fields.streetAddressId || this.streetAddressId;
            this.addressName = fields.addressName || this.addressName;
            this.address1 = fields.address1 || this.address1;
            this.address2 = fields.address2 || this.address2;
            this.city = fields.city || this.city;
            this.stateCode = fields.stateCode || this.stateCode;
            this.postalCode = fields.postalCode || this.postalCode;
            this.countryCode = fields.countryCode || this.countryCode;
        }
    }
}