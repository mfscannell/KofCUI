import { ConfigValueTypeEnums } from 'src/app/enums/configValueTypeEnums';
import { ConfigInputTypeEnums } from '../enums/configInputTypeEnums';

export class ConfigSetting {
    configSettingId: number = 0;
    configGroupId: number = 0;
    configName: string = '';
    configDisplayName: string = '';
    configSortValue: number = 0;
    helpText: string = '';
    configValueType: ConfigValueTypeEnums = ConfigValueTypeEnums.String;
    booleanValue: boolean = false;
    longValue: number = 0;
    stringValue: string = '';
    dateTimeValue?: string = undefined;
    inputType: ConfigInputTypeEnums = ConfigInputTypeEnums.TextBox

    public constructor(
        fields?: {
            configSettingId? : number,
            configGroupId? : number,
            configName?: string,
            configDisplayName?: string,
            configSortValue? : number,
            helpText? : string,
            configValueType?: ConfigValueTypeEnums,
            booleanValue?: boolean,
            longValue?: number,
            stringValue?: string,
            dateTimeValue?: string,
            inputType?: ConfigInputTypeEnums
    }) {
        if (fields) {
            this.configSettingId = fields.configSettingId || this.configSettingId;
            this.configGroupId = fields.configGroupId || this.configGroupId;
            this.configName = fields.configName || this.configName;
            this.configDisplayName = fields.configDisplayName || this.configDisplayName;
            this.configSortValue = fields.configSortValue || this.configSortValue;
            this.helpText = fields.helpText || this.helpText;
            this.configValueType = fields.configValueType || this.configValueType;
            this.booleanValue = fields.booleanValue || this.booleanValue;
            this.longValue = fields.longValue || this.longValue;
            this.stringValue = fields.stringValue || this.stringValue;
            this.dateTimeValue = fields.dateTimeValue || this.dateTimeValue;
            this.inputType = fields.inputType || this.inputType;
        }
    }
}