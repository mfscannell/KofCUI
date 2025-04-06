import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { YouTubePlayerModule } from '@angular/youtube-player';

//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpConfigInterceptor } from './interceptors/httpConfig.interceptor';

import { ActivityCategoriesComponent } from 'src/app/components/admin/activity-categories/activity-categories.component';
import { NavMenuComponent } from 'src/app/components/nav-menu/nav-menu.component';

import { AdminComponent } from 'src/app/components/admin/admin.component';
import { KnightsComponent } from 'src/app/components/admin/knights/knights.component';
import { UploadKnightsModalComponent } from 'src/app/components/admin/knights/upload-knights-modal/upload-knights-modal.component';
import { HomePageComponent } from 'src/app/components/home-page/home-page.component';
import { LeadershipRolesComponent } from './components/admin/leadership-roles/leadership-roles.component';
import { ActivityEventsComponent } from './components/admin/activity-events/activity-events.component';
import { OurCouncilComponent } from './components/our-council/our-council.component';
import { AboutKnightsComponent } from './components/aboutKnights/aboutKnights.component';
import { CalendarEventsComponent } from './components/calendar-events/calendar-events.component';
import { ConfigsComponent } from './components/admin/configs/configs.component';

import { AccountComponent } from './components/account/account.component';
import { KnightsGuard } from './guards/knights.guard';
import { LeadershipRolesGuard } from './guards/leadershipRoles.guard';
import { ActivitiesGuard } from './guards/activities.guard';
import { ActivityEventsGuard } from './guards/activityEvents.guard';
import { ConfigsGuard } from './guards/configs.guard';
import { AdminGuard } from './guards/admin.guard';
import { AccountGuard } from './guards/account.guard';
import { EditKnightPasswordModalComponent } from './components/admin/knights/edit-knight-password-modal/edit-knight-password-modal.component';
import { LoginComponent } from './components/login/login.component';
import { NavFooterComponent } from './components/nav-footer/nav-footer.component';
import { EventVolunteeringComponent } from './components/admin/event-volunteering/event-volunteering.component';
import { EventVolunteeringGuard } from './guards/eventVolunteering.guard';
import { AssetsComponent } from './components/admin/assets/assets.component';
import { AssetsGuard } from './guards/assets.guard';
import { EditKnightMemberInfoModalComponent } from './components/admin/knights/edit-knight-member-info-modal/edit-knight-member-info-modal.component';
import { EditKnightPersonalInfoModalComponent } from './components/admin/knights/edit-knight-personal-info-modal/edit-knight-personal-info-modal.component';
import { EditKnightMemberDuesModalComponent } from './components/admin/knights/edit-knight-member-dues-modal/edit-knight-member-dues-modal.component';
import { EditKnightActivityInterestsModalComponent } from './components/admin/knights/edit-knight-activity-interests-modal/edit-knight-activity-interests-modal.component';
import { EditLeadershipRoleModalComponent } from './components/admin/leadership-roles/edit-leadership-role-modal/edit-leadership-role-modal.component';
import { EditActivityModalComponent } from './components/admin/activity-categories/edit-activity-modal/edit-activity-modal.component';
import { CreateKnightModalComponent } from './components/admin/knights/create-knight-modal/create-knight-modal.component';
import { VolunteerForEventModalComponent } from './components/admin/event-volunteering/volunteer-for-event-modal/volunteer-for-event-modal.component';
import { EmailAboutEventModalComponent } from './components/admin/activity-events/email-about-event-modal/email-about-event-modal.component';
import { EditActivityEventModalComponent } from './components/admin/activity-events/edit-activity-event-modal/edit-activity-event-modal.component';
import { ToDisplayDatePipe } from './pipes/toDisplayDate.pipe';
import { ToDisplayTimePipe } from './pipes/toDisplayTime.pipe';

import { FilterActivitiesByCategoryPipe } from './pipes/filterActivitiesByCategory.pipe';
import { CanModifyActivityPipe } from './pipes/canModifyActivity.pipe';
import { FilterAdministrativeDivisionsPipe } from './pipes/filterAdministrativeDivisions.pipe';
import { FilterLeadershipRolesPipe } from './pipes/filterLeadershipRoles.pipe';
import { ToNumVolunteersNeededPipe } from './pipes/toNumVolunteersNeeded.pipe';
import { MeetsPasswordRequrementsPipe } from './pipes/meetsPasswordRequirements.pipe';
import { FilterActivityInterestsByCategoryPipe } from './pipes/filterActivityInterestsByCategory.pipe';
import { ConvertKnightIdToNamePipe } from './pipes/convertKnightIdToName.pipe';
import { IsEndDateAfterStartDatePipe } from './pipes/isEndDateAfterStartDate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavFooterComponent,
    NavMenuComponent,
    HomePageComponent,
    LoginComponent,
    AboutKnightsComponent,
    AccountComponent,
    OurCouncilComponent,
    CalendarEventsComponent,
    AdminComponent,
    ActivityCategoriesComponent,
    EditActivityModalComponent,
    KnightsComponent,
    CreateKnightModalComponent,
    EditKnightActivityInterestsModalComponent,
    EditKnightMemberDuesModalComponent,
    EditKnightMemberInfoModalComponent,
    EditKnightPersonalInfoModalComponent,
    EditKnightPasswordModalComponent,
    UploadKnightsModalComponent,
    LeadershipRolesComponent,
    EditLeadershipRoleModalComponent,
    ConfigsComponent,
    AssetsComponent,
    ActivityEventsComponent,
    EditActivityEventModalComponent,
    EmailAboutEventModalComponent,
    EventVolunteeringComponent,
    VolunteerForEventModalComponent,
    ToDisplayDatePipe,
    ConvertKnightIdToNamePipe,
    ToDisplayTimePipe,
    ToNumVolunteersNeededPipe,
    FilterActivitiesByCategoryPipe,
    FilterActivityInterestsByCategoryPipe,
    FilterLeadershipRolesPipe,
    CanModifyActivityPipe,
    IsEndDateAfterStartDatePipe,
    FilterAdministrativeDivisionsPipe,
    MeetsPasswordRequrementsPipe
  ],
  bootstrap: [AppComponent],
  imports: [
    YouTubePlayerModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomePageComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'aboutKnights', component: AboutKnightsComponent, pathMatch: 'full' },
      { path: 'aboutOurCouncil', component: OurCouncilComponent, pathMatch: 'full' },
      { path: 'upcomingEvents', component: CalendarEventsComponent, pathMatch: 'full' },
      { path: 'account', component: AccountComponent, pathMatch: 'full', canActivate: [AccountGuard] },
      { path: 'admin', component: AdminComponent, pathMatch: 'full', canActivate: [AdminGuard] },
      {
        path: 'admin/activities',
        component: ActivityCategoriesComponent,
        pathMatch: 'full',
        canActivate: [ActivitiesGuard],
      },
      { path: 'admin/knights', component: KnightsComponent, pathMatch: 'full', canActivate: [KnightsGuard] },
      {
        path: 'admin/leadershipRoles',
        component: LeadershipRolesComponent,
        pathMatch: 'full',
        canActivate: [LeadershipRolesGuard],
      },
      {
        path: 'admin/activityEvents',
        component: ActivityEventsComponent,
        pathMatch: 'full',
        canActivate: [ActivityEventsGuard],
      },
      {
        path: 'admin/eventVolunteering',
        component: EventVolunteeringComponent,
        pathMatch: 'full',
        canActivate: [EventVolunteeringGuard],
      },
      { path: 'admin/configSettings', component: ConfigsComponent, pathMatch: 'full', canActivate: [ConfigsGuard] },
      { path: 'admin/assets', component: AssetsComponent, pathMatch: 'full', canActivate: [AssetsGuard] },
      { path: '**', redirectTo: '/' },
    ]),
    //NgbModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
