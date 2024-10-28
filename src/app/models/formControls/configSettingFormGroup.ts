import { ConfigInputTypeEnums } from 'src/app/enums/configInputTypeEnums';
import { ConfigValueTypeEnums } from 'src/app/enums/configValueTypeEnums';

export interface ConfigSettingFormGroup {
  id: string;
  configGroupId: string;
  configName: string;
  configDisplayName: string;
  configSortValue: number;
  helpText: string;
  configValueType: ConfigValueTypeEnums;
  booleanValue: boolean;
  longValue: number;
  stringValue: string;
  guidValue: string;
  dateTimeValue: string | undefined;
  inputType: ConfigInputTypeEnums;
}
