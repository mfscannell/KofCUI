import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

import { ConfigGroup } from 'src/app/models/configGroup';
import { ConfigSetting } from 'src/app/models/configSetting';
import { ConfigsService } from 'src/app/services/configs.service';
import { ConfigValueTypeEnums } from 'src/app/enums/configValueTypeEnums';
import { TimeZone } from 'src/app/models/timeZone';
import { ConfigInputTypeEnums } from 'src/app/enums/configInputTypeEnums';
import { StringDropDownOption } from 'src/app/models/stringDropDownOption';

@Component({
  selector: 'kofc-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.scss']
})
export class ConfigsComponent implements OnInit, OnDestroy {
  private getAllConfigsSubscription?: Subscription;
  private updateConfigsSubscription?: Subscription;
  private getAllTimeZonesSubscription?: Subscription;
  configGroups: ConfigGroup[] = [];
  timeZones: TimeZone[] = [];
  editConfigsForm: FormGroup;
  showErrorMessage: boolean = false;
  errorMessages: string[] = [];
  showSuccessMessage: boolean = false;

  constructor(private configsService: ConfigsService) {
    this.editConfigsForm = new FormGroup({
      configGroups: new FormArray([])
    });
  }

  ngOnInit() {
    this.getAllConfigs();
    this.getAllTimeZones();
  }

  private getAllTimeZones() {
    let getAllTimeZonesObserver = {
      next: (timeZones: TimeZone[]) => this.timeZones = timeZones,
      error: (err: any) => this.logError('Error getting all timeZones.', err),
      complete: () => console.log('Time zones loaded.')
    };
    this.getAllTimeZonesSubscription = this.configsService.getAllTimeZones().subscribe(getAllTimeZonesObserver);
  }
  
  private getAllConfigs() {
    let getAllConfigsObserver = {
      next: (configGroups: ConfigGroup[]) => this.patchEditConfigGroupsForm(configGroups),
      error: (err: any) => this.logError('Error getting all configs.', err),
      complete: () => console.log('Config settings loaded.')
    };
    this.getAllConfigsSubscription = this.configsService.getAllConfigGroups().subscribe(getAllConfigsObserver);
  }

  private patchEditConfigGroupsForm(configGroups: ConfigGroup[]) {
    this.configGroups = configGroups;
    configGroups.forEach((configGroup: ConfigGroup) => {
      const configGroupFormGroup = new FormGroup({
        configGroupId: new FormControl(configGroup.configGroupId),
        configGroupName: new FormControl(configGroup.configGroupName),
        configGroupDisplayName: new FormControl(configGroup.configGroupDisplayName),
        configGroupSortValue: new FormControl(configGroup.configGroupSortValue),
        configSettings: new FormArray(this.initConfigSettings(configGroup.configSettings))
      });

      this.configGroupsForm.push(configGroupFormGroup);
    });
  }

  private initConfigSettings(configSettings: ConfigSetting[] | undefined) {
    let configSettingsArray: FormGroup[] = [];

    if (configSettings) {
      configSettings.forEach((configSetting) => {
        const configSettingFormGroup = new FormGroup({
          configId: new FormControl(configSetting.configId),
          configGroupId: new FormControl(configSetting.configGroupId),
          configName: new FormControl(configSetting.configName),
          configDisplayName: new FormControl(configSetting.configDisplayName),
          configSortValue: new FormControl(configSetting.configSortValue),
          helpText: new FormControl(configSetting.helpText),
          configValueType: new FormControl(configSetting.configValueType),
          booleanValue: new FormControl(configSetting.booleanValue),
          longValue: new FormControl(configSetting.longValue),
          stringValue: new FormControl(configSetting.stringValue),
          dateTimeValue: new FormControl(configSetting.dateTimeValue),
          inputType: new FormControl(configSetting.inputType)
        });

        configSettingsArray.push(configSettingFormGroup);
      });
    }

    return configSettingsArray;
  }

  isCheckBox(i: number, j: number) {
    return this.configGroups[i].configSettings[j].inputType === ConfigInputTypeEnums.CheckBox;
  }

  isStringInput(i: number, j: number) {
    return this.configGroups[i].configSettings[j].inputType === ConfigInputTypeEnums.TextBox;
  }

  isStringDropDown(i: number, j: number) {
    return this.configGroups[i].configSettings[j].inputType === ConfigInputTypeEnums.DropDown &&
    this.configGroups[i].configSettings[j].configValueType === ConfigValueTypeEnums.String;
  }

  getStringDropDownList(i: number, j: number) : StringDropDownOption[] {
    if (this.configGroups[i].configSettings[j].configName === 'CouncilTimeZone') {
      return this.timeZones;
    }

    return [];
  }

  isLong(i: number, j: number) {
    return this.configGroups[i].configSettings[j].configValueType === ConfigValueTypeEnums.Long;
  }

  isDate(i: number, j: number) {
    return this.configGroups[i].configSettings[j].configValueType === ConfigValueTypeEnums.Date;
  }

  get configGroupsForm() {
    return this.editConfigsForm.controls["configGroups"] as FormArray;
  }

  getConfigGroupName(index: number) {
    return this.configGroups[index].configGroupDisplayName
  }

  getConfigSettings(configGroup: AbstractControl) {
    const something = configGroup as FormGroup;
    const configSettings = something.controls["configSettings"] as FormArray;

    return configSettings.controls;
  }

  getConfigName(i: number, j: number) {
    return this.configGroups[i].configSettings[j].configDisplayName;
  }

  getConfigHelpText(i: number, j: number) {
    return this.configGroups[i].configSettings[j].helpText;
  }

  ngOnDestroy() {
      if (this.getAllConfigsSubscription) {
        this.getAllConfigsSubscription.unsubscribe();
      }

      if (this.updateConfigsSubscription) {
        this.updateConfigsSubscription.unsubscribe();
      }

      if (this.getAllTimeZonesSubscription) {
        this.getAllTimeZonesSubscription.unsubscribe();
      }
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (let key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.showSuccessMessage = false;
    this.showErrorMessage = true;
  }

  private passBack(configSettings: ConfigSetting[]) {
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
  }

  onSubmitEditConfigSettings() {
    let updateActivityEventRequest = this.mapFormToConfigSettings();

    let updateConfigSettingsObserver = {
      next: (configSettings: ConfigSetting[]) => this.passBack(configSettings),
      error: (err: any) => this.logError('Error updating Config Settings.', err),
      complete: () => console.log('Config settings updated.')
    };

    this.updateConfigsSubscription = this.configsService.updateConfigSettings(updateActivityEventRequest).subscribe(updateConfigSettingsObserver);
  }

  mapFormToConfigSettings() {
    let rawForm = this.editConfigsForm.getRawValue();
    let configSettings: ConfigSetting[] = [];
    
    rawForm?.configGroups?.map((configGroup: any) => {
      configGroup.configSettings?.forEach((configSetting: any) => {
        configSettings.push(new ConfigSetting({
          configId: configSetting.configId,
          configGroupId: configSetting.configGroupId,
          configName: configSetting.configName,
          configDisplayName: configSetting.configDisplayName,
          configSortValue: configSetting.configSortValue,
          helpText: configSetting.helpText,
          configValueType: configSetting.configValueType,
          booleanValue: configSetting.booleanValue,
          longValue: configSetting.longValue,
          stringValue: configSetting.stringValue,
          dateTimeValue: configSetting.dateTimeValue,
          inputType: configSetting.inputType
        }));
      });
    });

    let something = 5;

    return configSettings;
  }
}
