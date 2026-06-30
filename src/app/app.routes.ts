import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { AboutKnightsComponent } from './components/aboutKnights/aboutKnights.component';
import { OurCouncilComponent } from './components/our-council/our-council.component';
import { CalendarEventsComponent } from './components/calendar-events/calendar-events.component';
import { AccountComponent } from './components/account/account.component';
import { AdminComponent } from './components/admin/admin.component';
import { AccountGuard } from './guards/account.guard';
import { AdminGuard } from './guards/admin.guard';
import { ActivityCategoriesComponent } from './components/admin/activity-categories/activity-categories.component';
import { ActivitiesGuard } from './guards/activities.guard';
import { KnightsComponent } from './components/admin/knights/knights.component';
import { KnightsGuard } from './guards/knights.guard';
import { AssetsComponent } from './components/admin/assets/assets.component';
import { ConfigsComponent } from './components/admin/configs/configs.component';
import { ConfigsGuard } from './guards/configs.guard';
import { AssetsGuard } from './guards/assets.guard';
import { EventVolunteeringGuard } from './guards/eventVolunteering.guard';
import { EventVolunteeringComponent } from './components/admin/event-volunteering/event-volunteering.component';
import { ActivityEventsGuard } from './guards/activityEvents.guard';
import { ActivityEventsComponent } from './components/admin/activity-events/activity-events.component';
import { LeadershipRolesGuard } from './guards/leadershipRoles.guard';
import { LeadershipRolesComponent } from './components/admin/leadership-roles/leadership-roles.component';
import { MemberDuesAmountsGuard } from './guards/memberDuesAmounts.guard';
import { MemberDuesAmountsComponent } from './components/admin/member-dues-amounts/member-dues-amounts.component';

export const routes: Routes = [
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
          path: 'admin/memberDuesAmounts',
          component: MemberDuesAmountsComponent,
          pathMatch: 'full',
          canActivate: [MemberDuesAmountsGuard],
        },
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
        { path: '**', redirectTo: '/' }
];
