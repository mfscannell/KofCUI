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

    static Alabama: AddressState = new AddressState({
        displayName: 'Alabama',
        stateCode: 'AL'
    });
    static Alaska: AddressState = new AddressState({
        displayName: 'Alaska',
        stateCode: 'AK'
    });
    static Arizona: AddressState = new AddressState({
        displayName: 'Arizona',
        stateCode: 'AZ'
    });
    static Arkansas: AddressState = new AddressState({
        displayName: 'Arkansas',
        stateCode: 'AR'
    });
    static California: AddressState = new AddressState({
        displayName: 'California',
        stateCode: 'CA'
    });
    static Colorado: AddressState = new AddressState({
        displayName: 'Colorado',
        stateCode: 'CO'
    });
    static Connecticut: AddressState = new AddressState({
        displayName: 'Connecticut',
        stateCode: 'CT'
    });
    static Delaware: AddressState = new AddressState({
        displayName: 'Delaware',
        stateCode: 'DE'
    });
    static Florida: AddressState = new AddressState({
        displayName: 'Florida',
        stateCode: 'FL'
    });
    static Georgia: AddressState = new AddressState({
        displayName: 'Georgia',
        stateCode: 'GA'
    });
    static Hawaii: AddressState = new AddressState({
        displayName: 'Hawaii',
        stateCode: 'HI'
    });
    static Idaho: AddressState = new AddressState({
        displayName: 'Idaho',
        stateCode: 'ID'
    });
    static Illinois: AddressState = new AddressState({
        displayName: 'Illinois',
        stateCode: 'IL'
    });
    static Indiana: AddressState = new AddressState({
        displayName: 'Indiana',
        stateCode: 'IN'
    });
    static Iowa: AddressState = new AddressState({
        displayName: 'Iowa',
        stateCode: 'IA'
    });
    static Kansas: AddressState = new AddressState({
        displayName: 'Kansas',
        stateCode: 'KS'
    });
    static Kentucky: AddressState = new AddressState({
        displayName: 'Kentucky',
        stateCode: 'KY'
    });
    static Louisiana: AddressState = new AddressState({
        displayName: 'Louisiana',
        stateCode: 'LA'
    });
    static Maine: AddressState = new AddressState({
        displayName: 'Maine',
        stateCode: 'ME'
    });
    static Maryland: AddressState = new AddressState({
        displayName: 'Maryland',
        stateCode: 'MD'
    });
    static Massachusetts: AddressState = new AddressState({
        displayName: 'Massachusetts',
        stateCode: 'MA'
    });
    static Michigan: AddressState = new AddressState({
        displayName: 'Michigan',
        stateCode: 'MI'
    });
    static Minnesota: AddressState = new AddressState({
        displayName: 'Minnesota',
        stateCode: 'MN'
    });
    static Mississippi: AddressState = new AddressState({
        displayName: 'Mississippi',
        stateCode: 'MS'
    });
    static Missouri: AddressState = new AddressState({
        displayName: 'Missouri',
        stateCode: 'MO'
    });

    static AllStates: AddressState[] = [
        AddressState.Alabama,
        AddressState.Alaska,
        AddressState.Arizona,
        AddressState.Arkansas,
        AddressState.California,
        AddressState.Colorado,
        AddressState.Connecticut,
        AddressState.Delaware,
        AddressState.Florida,
        AddressState.Georgia,
        AddressState.Hawaii,
        AddressState.Idaho,
        AddressState.Illinois,
        AddressState.Indiana,
        AddressState.Iowa,
        AddressState.Kansas,
        AddressState.Kentucky,
        AddressState.Louisiana,
        AddressState.Maine,
        AddressState.Maryland,
        AddressState.Massachusetts,
        AddressState.Michigan,
        AddressState.Minnesota,
        AddressState.Mississippi,
        AddressState.Missouri
    ];
}