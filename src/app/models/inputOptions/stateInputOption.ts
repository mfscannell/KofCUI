export class StateInputOption {
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

  static Alabama: StateInputOption = new StateInputOption({
      displayName: 'Alabama',
      stateCode: 'AL'
  });
  static Alaska: StateInputOption = new StateInputOption({
      displayName: 'Alaska',
      stateCode: 'AK'
  });
  static Arizona: StateInputOption = new StateInputOption({
      displayName: 'Arizona',
      stateCode: 'AZ'
  });
  static Arkansas: StateInputOption = new StateInputOption({
      displayName: 'Arkansas',
      stateCode: 'AR'
  });
  static California: StateInputOption = new StateInputOption({
      displayName: 'California',
      stateCode: 'CA'
  });
  static Colorado: StateInputOption = new StateInputOption({
      displayName: 'Colorado',
      stateCode: 'CO'
  });
  static Connecticut: StateInputOption = new StateInputOption({
      displayName: 'Connecticut',
      stateCode: 'CT'
  });
  static Delaware: StateInputOption = new StateInputOption({
      displayName: 'Delaware',
      stateCode: 'DE'
  });
  static Florida: StateInputOption = new StateInputOption({
      displayName: 'Florida',
      stateCode: 'FL'
  });
  static Georgia: StateInputOption = new StateInputOption({
      displayName: 'Georgia',
      stateCode: 'GA'
  });
  static Hawaii: StateInputOption = new StateInputOption({
      displayName: 'Hawaii',
      stateCode: 'HI'
  });
  static Idaho: StateInputOption = new StateInputOption({
      displayName: 'Idaho',
      stateCode: 'ID'
  });
  static Illinois: StateInputOption = new StateInputOption({
      displayName: 'Illinois',
      stateCode: 'IL'
  });
  static Indiana: StateInputOption = new StateInputOption({
      displayName: 'Indiana',
      stateCode: 'IN'
  });
  static Iowa: StateInputOption = new StateInputOption({
      displayName: 'Iowa',
      stateCode: 'IA'
  });
  static Kansas: StateInputOption = new StateInputOption({
      displayName: 'Kansas',
      stateCode: 'KS'
  });
  static Kentucky: StateInputOption = new StateInputOption({
      displayName: 'Kentucky',
      stateCode: 'KY'
  });
  static Louisiana: StateInputOption = new StateInputOption({
      displayName: 'Louisiana',
      stateCode: 'LA'
  });
  static Maine: StateInputOption = new StateInputOption({
      displayName: 'Maine',
      stateCode: 'ME'
  });
  static Maryland: StateInputOption = new StateInputOption({
      displayName: 'Maryland',
      stateCode: 'MD'
  });
  static Massachusetts: StateInputOption = new StateInputOption({
      displayName: 'Massachusetts',
      stateCode: 'MA'
  });
  static Michigan: StateInputOption = new StateInputOption({
      displayName: 'Michigan',
      stateCode: 'MI'
  });
  static Minnesota: StateInputOption = new StateInputOption({
      displayName: 'Minnesota',
      stateCode: 'MN'
  });
  static Mississippi: StateInputOption = new StateInputOption({
      displayName: 'Mississippi',
      stateCode: 'MS'
  });
  static Missouri: StateInputOption = new StateInputOption({
      displayName: 'Missouri',
      stateCode: 'MO'
  });

  static AllStates: StateInputOption[] = [
      StateInputOption.Alabama,
      StateInputOption.Alaska,
      StateInputOption.Arizona,
      StateInputOption.Arkansas,
      StateInputOption.California,
      StateInputOption.Colorado,
      StateInputOption.Connecticut,
      StateInputOption.Delaware,
      StateInputOption.Florida,
      StateInputOption.Georgia,
      StateInputOption.Hawaii,
      StateInputOption.Idaho,
      StateInputOption.Illinois,
      StateInputOption.Indiana,
      StateInputOption.Iowa,
      StateInputOption.Kansas,
      StateInputOption.Kentucky,
      StateInputOption.Louisiana,
      StateInputOption.Maine,
      StateInputOption.Maryland,
      StateInputOption.Massachusetts,
      StateInputOption.Michigan,
      StateInputOption.Minnesota,
      StateInputOption.Mississippi,
      StateInputOption.Missouri
  ];
}