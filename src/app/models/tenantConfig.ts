import { ExternalLink } from "./externalLink";

export interface TenantConfig {
  id: string;
  facebookUrl: string;
  twitterUrl: string;
  councilTimeZone: string;
  allowChangeActivitySubscription: boolean;
  externalLinks: ExternalLink[];
}