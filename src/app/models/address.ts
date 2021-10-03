export class Address {
    addressId?: number;
    addressName: string = "";
    address1: string = "";
    address2: string = "";
    addressCity: string = "";
    addressStateCode: string = "";
    addressPostalCode: string = "";
    addressCountryCode: string = "";

    public constructor(
        fields?: {
            addressId? : number,
            addressName? : string,
            address1: string,
            address2: string,
            addressCity: string,
            addressStateCode: string,
            addressPostalCode: string,
            addressCountryCode: string
    }) {
        if (fields) {
            this.addressId = fields.addressId || this.addressId;
            this.addressName = fields.addressName || this.addressName;
            this.address1 = fields.address1 || this.address1;
            this.address2 = fields.address2 || this.address2;
            this.addressCity = fields.addressCity || this.addressCity;
            this.addressStateCode = fields.addressStateCode || this.addressStateCode;
            this.addressPostalCode = fields.addressPostalCode || this.addressPostalCode;
            this.addressCountryCode = fields.addressCountryCode || this.addressCountryCode;
        }
    }
}