import { ConfigSetting } from 'src/app/models/configSetting';

export interface ConfigGroup {
    configGroupId: number;
    configGroupName: string;
    configGroupDisplayName: string;
    configGroupSortValue: number;
    configSettings: ConfigSetting[];
}