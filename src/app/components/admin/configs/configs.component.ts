import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { ConfigsService } from 'src/app/services/configs.service';
import { GenericFormOption } from 'src/app/models/inputOptions/genericFormOption';
import { FormsService } from 'src/app/services/forms.service';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { TenantConfig } from 'src/app/models/tenantConfig';
import { ExternalLink } from 'src/app/models/externalLink';
import { ConfigsFormGroup } from 'src/app/forms/configsFormGroup';
import { ExternalLinksFormGroup } from 'src/app/forms/externalLinksFormGroup';

@Component({
  selector: 'kofc-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.scss'],
})
export class ConfigsComponent implements OnInit, OnDestroy {
  private getAllConfigsSubscription?: Subscription;
  private updateConfigsSubscription?: Subscription;
  private getAllTimeZonesSubscription?: Subscription;
  public tenantConfigs?: TenantConfig;
  timeZones: GenericFormOption[] = [];
  editConfigsForm: FormGroup<ConfigsFormGroup>;

  showSaveMessage: boolean = false;
  success: boolean = true;
  errorMessages: string[] = [];
  modalHeaderText: string = '';

  constructor(
    private configsService: ConfigsService,
    private formsService: FormsService,
  ) {
    this.editConfigsForm = this.initForm();
  }

  ngOnInit() {
    this.getAllConfigs();
    this.getAllTimeZones();
  }

  private initForm(): FormGroup<ConfigsFormGroup> {
    return new FormGroup<ConfigsFormGroup>({
      id: new FormControl<string>('', { nonNullable: true }),
      facebookUrl: new FormControl<string>('', { nonNullable: true }),
      twitterUrl: new FormControl<string>('', { nonNullable: true }),
      councilTimeZone: new FormControl<string>('', { nonNullable: true }),
      allowChangeActivitySubscription: new FormControl<boolean>(false, { nonNullable: true }),
      externalLinksList: new FormArray<FormGroup<ExternalLinksFormGroup>>([])
    });
  }

  public deleteExternalLink(roleIndex: number) {
    this.editConfigsForm.controls.externalLinksList.removeAt(roleIndex);
  }

  public addExternalLink() {
    const externalLink = new FormGroup<ExternalLinksFormGroup>({
      websiteName: new FormControl<string>('', { nonNullable: true }),
      url: new FormControl<string>('', { nonNullable: true }),
    });

    this.editConfigsForm.controls.externalLinksList.push(externalLink);
  }

  private getAllTimeZones() {
    const getAllTimeZonesObserver = {
      next: (timeZones: GenericFormOption[]) => (this.timeZones = timeZones),
      error: (err: ApiResponseError) => this.logError('Error getting all timeZones.', err),
      complete: () => console.log('Time zones loaded.'),
    };
    this.getAllTimeZonesSubscription = this.formsService.getTimeZoneFormOptions().subscribe(getAllTimeZonesObserver);
  }

  private getAllConfigs() {
    const getAllConfigsObserver = {
      next: (tenantConfig: TenantConfig) => this.patchEditConfigGroupsForm(tenantConfig),
      error: (err: ApiResponseError) => this.logError('Error getting all configs.', err),
      complete: () => console.log('Config settings loaded.'),
    };
    this.getAllConfigsSubscription = this.configsService.getAllConfig().subscribe(getAllConfigsObserver);
  }

  private patchEditConfigGroupsForm(tenantConfigRespone: TenantConfig) {
    console.log('patchEditConfigGroupForm');
    this.tenantConfigs = tenantConfigRespone;

    this.editConfigsForm.patchValue({
      id: this.tenantConfigs.id,
      facebookUrl: this.tenantConfigs.facebookUrl,
      twitterUrl: this.tenantConfigs.twitterUrl,
      councilTimeZone: this.tenantConfigs.councilTimeZone,
      allowChangeActivitySubscription: this.tenantConfigs.allowChangeActivitySubscription
    });

    this.tenantConfigs.externalLinks.forEach((externalLink) => {
      const externalLinkFormGroup = new FormGroup<ExternalLinksFormGroup>({
        websiteName: new FormControl<string>(externalLink.websiteName, { nonNullable: true}),
        url: new FormControl<string>(externalLink.url, { nonNullable: true}),
      });

      this.editConfigsForm.controls.externalLinksList.push(externalLinkFormGroup);
    })
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

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);
  }

  private showErrorModal(err: ApiResponseError) {
    this.showSaveMessage = true;
    this.success = false;

    if (typeof err?.error === 'string') {
      this.errorMessages = [err?.error];
    } else if (Array.isArray(err?.error)) {
      err?.error.forEach((e: string) => {
        this.errorMessages.push(e);
      });
    } else {
      const errors = [];

      for (const key in err?.error?.errors) {
        errors.push(err?.error?.errors[key][0]);
      }

      this.errorMessages = errors;
    }
  }

  private showSuccessModal(configSettings: TenantConfig) {
    console.log(configSettings);
    this.configsService.flagWebsiteContentStale();
    this.showSaveMessage = true;
    this.success = true;
    this.errorMessages = [];
  }

  onSubmitEditConfigSettings() {
    const updateConfigSettingsRequest = this.mapFormToConfigSettings();

    const updateConfigSettingsObserver = {
      next: (configSettings: TenantConfig) => this.showSuccessModal(configSettings),
      error: (err: ApiResponseError) => {
        this.logError('Error updating Config Settings.', err);
        this.showErrorModal(err);
      },
      complete: () => console.log('Config settings updated.'),
    };

    this.updateConfigsSubscription = this.configsService
      .updateConfigSettings(updateConfigSettingsRequest)
      .subscribe(updateConfigSettingsObserver);
  }

  mapFormToConfigSettings(): TenantConfig {
    const rawForm = this.editConfigsForm.getRawValue();

    const externalLinks = rawForm?.externalLinksList.map(function (
      externalLinkForm: ExternalLink
    ) {
      const externalLink: ExternalLink = {
        websiteName: externalLinkForm.websiteName,
        url: externalLinkForm.url
      };
      return externalLink;
    });

    const configSettings: TenantConfig = {
      id: rawForm.id,
      facebookUrl: rawForm.facebookUrl,
      twitterUrl: rawForm.twitterUrl,
      councilTimeZone: rawForm.councilTimeZone,
      allowChangeActivitySubscription: rawForm.allowChangeActivitySubscription,
      externalLinks: externalLinks
    };

    console.log(configSettings);

    return configSettings;
  }
}
