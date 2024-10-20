import { ConfigValueTypeEnums } from 'src/app/enums/configValueTypeEnums';
import { ConfigInputTypeEnums } from '../enums/configInputTypeEnums';

export interface ConfigSetting {
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
    dateTimeValue?: string;
    guidValue: string;
    inputType: ConfigInputTypeEnums;
}