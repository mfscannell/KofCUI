export class AddressState {
    displayName: string = '';
    stateCode: string = '';

    public constructor(
        fields?: {
            displayName? : string,
            stateCode?: string
    }) {
        if (fields) {
            this.displayName = fields.displayName || this.displayName;
            this.stateCode = fields.stateCode || this.stateCode;
        }
    }

    static Kansas: AddressState = new AddressState({
        displayName: 'Kansas',
        stateCode: 'KS'
    });
    static Missouri: AddressState = new AddressState({
        displayName: 'Missouri',
        stateCode: 'MO'
    });

    static AllStates: AddressState[] = [
        AddressState.Kansas,
        AddressState.Missouri
    ];
}