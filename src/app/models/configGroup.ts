import { ConfigSetting } from 'src/app/models/configSetting';

export class ConfigGroup {
    configGroupId: number = 0;
    configGroupName: string = '';
    configGroupDisplayName: string = '';
    configGroupSortValue: number = 0;
    configSettings: ConfigSetting[] = [];

    public constructor(
        fields?: {
            configGroupId? : number,
            configGroupName?: string,
            configGroupDisplayName?: string,
            configGroupSortValue? : number,
            configSettings?: ConfigSetting[]
    }) {
        if (fields) {
            this.configGroupId = fields.configGroupId || this.configGroupId;
            this.configGroupName = fields.configGroupName || this.configGroupName;
            this.configGroupDisplayName = fields.configGroupDisplayName || this.configGroupDisplayName;
            this.configGroupSortValue = fields.configGroupSortValue || this.configGroupSortValue;
            this.configSettings = fields.configSettings || this.configSettings;
        }
    }
}