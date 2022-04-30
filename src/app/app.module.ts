import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { YouTubePlayerModule } from '@angular/youtube-player';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpConfigInterceptor } from './config/httpConfig.interceptor';

import { ActivityCategoriesComponent } from 'src/app/components/admin/activity-categories/activity-categories.component';
import { EditActivityCategoryModalComponent } from './components/admin/activity-categories/edit-activity-category-modal/edit-activity-category-modal.component';
import { EditActivityModalComponent } from './components/admin/activity-categories/edit-activity-modal/edit-activity-modal.component';
import { NavMenuComponent } from 'src/app/components/nav-menu/nav-menu.component';

import { AdminComponent } from 'src/app/components/admin/admin.component';
import { KnightsComponent } from 'src/app/components/admin/knights/knights.component';
import { EditKnightModalComponent } from 'src/app/components/admin/knights/edit-knight-modal/edit-knight-modal.component';
import { UploadKnightsModalComponent } from 'src/app/components/admin/knights/upload-knights-modal/upload-knights-modal.component';
import { HomePageComponent } from 'src/app/components/home-page/home-page.component';
import { LeadershipRolesComponent } from './components/admin/leadership-roles/leadership-roles.component';
import { EditLeadershipRoleModalComponent } from './components/admin/leadership-roles/edit-leadership-role-modal/edit-leadership-role-modal.component';
import { ActivityEventsComponent } from './components/admin/activity-events/activity-events.component';
import { EditActivityEventModalComponent } from './components/admin/activity-events/edit-activity-event-modal/edit-activity-event-modal.component';
import { OurCouncilComponent } from './components/our-council/our-council.component';
import { AboutKnightsComponent } from './components/aboutKnights/aboutKnights.component';
import { CalendarEventsComponent } from './components/calendar-events/calendar-events.component';
import { ViewUpcomingEventModalComponent } from './components/calendar-events/view-upcoming-event-modal/view-upcoming-event-modal.component';
import { VolunteerForActivityEventModalComponent } from './components/admin/activity-events/volunteer-for-activity-event-modal/volunteer-for-activity-event-modal.component';
import { ConfigsComponent } from './components/admin/configs/configs.component';

import { AccountComponent } from './components/account/account.component';
import { AccountPersonalInfoComponent } from './components/account/account-personalInfo/account-personalInfo.component';
import { AccountInterestsComponent } from './components/account/account-interests/account-interests.component';
import { SendEmailModalComponent } from './components/admin/activity-events/send-email-modal/send-email-modal.component';
import { KnightsGuard } from './guards/knights.guard';
import { LeadershipRolesGuard } from './guards/leadershipRoles.guard';
import { ActivitiesGuard } from './guards/activities.guard';
import { ActivityEventsGuard } from './guards/activityEvents.guard';
import { ConfigsGuard } from './guards/configs.guard';
import { AdminGuard } from './guards/admin.guard';
import { AccountGuard } from './guards/account.guard';
import { EditKnightPasswordModalComponent } from './components/admin/knights/edit-knight-password-modal/edit-knight-password-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomePageComponent,
    AboutKnightsComponent,
    AccountComponent,
    AccountInterestsComponent,
    AccountPersonalInfoComponent,
    OurCouncilComponent,
    CalendarEventsComponent,
    ViewUpcomingEventModalComponent,
    AdminComponent,
    ActivityCategoriesComponent,
    EditActivityCategoryModalComponent,
    EditActivityModalComponent,
    KnightsComponent,
    EditKnightModalComponent,
    EditKnightPasswordModalComponent,
    UploadKnightsModalComponent,
    LeadershipRolesComponent,
    EditLeadershipRoleModalComponent,
    ConfigsComponent,
    ActivityEventsComponent,
    SendEmailModalComponent,
    VolunteerForActivityEventModalComponent,
    EditActivityEventModalComponent
  ],
  imports: [
    YouTubePlayerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomePageComponent, pathMatch: 'full' },
      { path: 'aboutKnights', component: AboutKnightsComponent, pathMatch: 'full' },
      { path: 'aboutOurCouncil', component: OurCouncilComponent, pathMatch: 'full' },
      { path: 'upcomingEvents', component: CalendarEventsComponent, pathMatch: 'full' },
      { path: 'account', component: AccountComponent, pathMatch: 'full', canActivate: [AccountGuard] },
      { path: 'account/interests', component: AccountInterestsComponent, pathMatch: 'full', canActivate: [AccountGuard] },
      { path: 'account/personalInfo', component: AccountPersonalInfoComponent, pathMatch: 'full', canActivate: [AccountGuard] },
      { path: 'admin', component: AdminComponent, pathMatch: 'full', canActivate: [AdminGuard] },
      { path: 'admin/activities', component: ActivityCategoriesComponent, pathMatch: 'full', canActivate: [ActivitiesGuard] },
      { path: 'admin/knights', component: KnightsComponent, pathMatch: 'full', canActivate: [KnightsGuard] },
      { path: 'admin/leadershipRoles', component: LeadershipRolesComponent, pathMatch: 'full', canActivate: [LeadershipRolesGuard] },
      { path: 'admin/activityEvents', component: ActivityEventsComponent, pathMatch: 'full', canActivate: [ActivityEventsGuard] },
      { path: 'admin/configSettings', component: ConfigsComponent, pathMatch: 'full', canActivate: [ConfigsGuard] },
      { path: '**', redirectTo: '/' }
    ]),
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
