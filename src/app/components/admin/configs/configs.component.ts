import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { ConfigGroup } from 'src/app/models/configGroup';
import { ConfigSetting } from 'src/app/models/configSetting';
import { ConfigsService } from 'src/app/services/configs.service';
import { ConfigValueTypeEnums } from 'src/app/enums/configValueTypeEnums';
import { TimeZoneFormOption } from 'src/app/models/inputOptions/timeZoneFormOption';
import { ConfigInputTypeEnums } from 'src/app/enums/configInputTypeEnums';
import { StringDropDownOption } from 'src/app/models/stringDropDownOption';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { FormsService } from 'src/app/services/forms.service';

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
  timeZones: TimeZoneFormOption[] = [];
  editConfigsForm: UntypedFormGroup;

  showSaveMessage: boolean = false;
  success: boolean = true;
  errorMessages: string[] = [];
  modalHeaderText: string = '';

  constructor(
    private configsService: ConfigsService,
    private formsService: FormsService) {
    this.editConfigsForm = new UntypedFormGroup({
      configGroups: new UntypedFormArray([])
    });
  }

  ngOnInit() {
    this.getAllConfigs();
    this.getAllTimeZones();
  }

  private getAllTimeZones() {
    let getAllTimeZonesObserver = {
      next: (timeZones: TimeZoneFormOption[]) => this.timeZones = timeZones,
      error: (err: any) => this.logError('Error getting all timeZones.', err),
      complete: () => console.log('Time zones loaded.')
    };
    this.getAllTimeZonesSubscription = this.formsService.getTimeZoneFormOptions().subscribe(getAllTimeZonesObserver);
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
      const configGroupFormGroup = new UntypedFormGroup({
        id: new UntypedFormControl(configGroup.id),
        configGroupName: new UntypedFormControl(configGroup.configGroupName),
        configGroupDisplayName: new UntypedFormControl(configGroup.configGroupDisplayName),
        configGroupSortValue: new UntypedFormControl(configGroup.configGroupSortValue),
        configSettings: new UntypedFormArray(this.initConfigSettings(configGroup.configSettings))
      });

      this.configGroupsForm.push(configGroupFormGroup);
    });
  }

  private initConfigSettings(configSettings: ConfigSetting[] | undefined) {
    let configSettingsArray: UntypedFormGroup[] = [];

    if (configSettings) {
      configSettings.forEach((configSetting) => {
        const configSettingFormGroup = new UntypedFormGroup({
          id: new UntypedFormControl(configSetting.id),
          configGroupId: new UntypedFormControl(configSetting.configGroupId),
          configName: new UntypedFormControl(configSetting.configName),
          configDisplayName: new UntypedFormControl(configSetting.configDisplayName),
          configSortValue: new UntypedFormControl(configSetting.configSortValue),
          helpText: new UntypedFormControl(configSetting.helpText),
          configValueType: new UntypedFormControl(configSetting.configValueType),
          booleanValue: new UntypedFormControl(configSetting.booleanValue),
          longValue: new UntypedFormControl(configSetting.longValue),
          stringValue: new UntypedFormControl(configSetting.stringValue),
          guidValue: new UntypedFormControl(configSetting.guidValue),
          dateTimeValue: new UntypedFormControl(configSetting.dateTimeValue),
          inputType: new UntypedFormControl(configSetting.inputType)
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

  isGuidDropDown(i: number, j: number) {
    return this.configGroups[i].configSettings[j].inputType === ConfigInputTypeEnums.DropDown &&
    this.configGroups[i].configSettings[j].configValueType === ConfigValueTypeEnums.Guid;
  }

  getStringDropDownList(i: number, j: number) : GenericFormOption[] {
    return [];
  }

  getGuidDropDownList(i: number, j: number) : GenericFormOption[] {
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
    return this.editConfigsForm.controls["configGroups"] as UntypedFormArray;
  }

  getConfigGroupName(index: number) {
    return this.configGroups[index].configGroupDisplayName
  }

  getConfigSettings(configGroup: AbstractControl) {
    const something = configGroup as UntypedFormGroup;
    const configSettings = something.controls["configSettings"] as UntypedFormArray;

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
  }

  private showErrorModal(err: any) {
    this.showSaveMessage = true;
    this.success = false;

    if (typeof err?.error === 'string') {
      this.errorMessages = [err?.err];
    } else {
      let errors = [];

      for (let key in err?.error?.errors) {
        errors.push(err?.error?.errors[key][0]);
      }

      this.errorMessages = errors;
    }
  }

  private showSuccessModal() {
    this.showSaveMessage = true;
    this.success = true;
    this.errorMessages = [];
  }

  onSubmitEditConfigSettings() {
    let updateConfigSettingsRequest = this.mapFormToConfigSettings();

    let updateConfigSettingsObserver = {
      next: (configSettings: ConfigSetting[]) => this.showSuccessModal(),
      error: (err: any) => {this.logError('Error updating Config Settings.', err); this.showErrorModal(err)},
      complete: () => console.log('Config settings updated.')
    };

    this.updateConfigsSubscription = this.configsService.updateConfigSettings(updateConfigSettingsRequest).subscribe(updateConfigSettingsObserver);
  }

  mapFormToConfigSettings() {
    let rawForm = this.editConfigsForm.getRawValue();
    let configSettings: ConfigSetting[] = [];
    
    rawForm?.configGroups?.map((configGroup: any) => {
      configGroup.configSettings?.forEach((configSetting: any) => {
        let updatedConfig: ConfigSetting = {
          id: configSetting.id,
          configGroupId: configSetting.configGroupId,
          configName: configSetting.configName,
          configDisplayName: configSetting.configDisplayName,
          configSortValue: configSetting.configSortValue,
          helpText: configSetting.helpText,
          configValueType: configSetting.configValueType,
          booleanValue: configSetting.booleanValue,
          longValue: configSetting.longValue,
          stringValue: configSetting.stringValue,
          guidValue: configSetting.guidValue,
          dateTimeValue: configSetting.dateTimeValue,
          inputType: configSetting.inputType
        };
        configSettings.push(updatedConfig);
      });
    });

    return configSettings;
  }
}
