import { ConfigValueTypeEnums } from 'src/app/enums/configValueTypeEnums';
import { ConfigInputTypeEnums } from '../enums/configInputTypeEnums';

export interface ConfigSetting {
    configSettingId: number;
    configGroupId: number;
    configName: string;
    configDisplayName: string;
    configSortValue: number;
    helpText: string;
    configValueType: ConfigValueTypeEnums;
    booleanValue: boolean;
    longValue: number;
    stringValue: string;
    dateTimeValue?: string;
    inputType: ConfigInputTypeEnums;
}