import { ConfigSetting } from 'src/app/models/configSetting';

export interface ConfigGroup {
  id: string;
  configGroupName: string;
  configGroupDisplayName: string;
  configGroupSortValue: number;
  configSettings: ConfigSetting[];
}
