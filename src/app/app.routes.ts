import {Routes} from '@angular/router';
import {HomeComponent} from './protected/home/home.component';
import {IntroComponent} from './intro/intro.component';
import {AuthGuard} from './auth/shared/service/auth.guard';
import {AnthologyComponent} from './protected/anthology/anthology.component';
import {AuthService} from './auth/shared/service/auth.service';
import {inject} from '@angular/core';
import {MarqueeComponent} from './shared/components/marquee/marquee.component';
import {ProfileComponent} from './protected/account/profile/profile.component';
import {OrderListComponent} from './protected/account/order-list/order-list.component';
import {AdminPanelComponent} from './admin/admin-panel/admin-panel.component';
import {CollectionsComponent} from './protected/shared/components/collections/collections.component';
import {PaymentSuccessComponent} from './protected/shared/components/payment-success/payment-success.component';
import {AdminGuard} from './auth/shared/service/admin.guard';
import {PolicyComponent} from './policy/policy.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: () => {
      const authService = inject(AuthService);
      return authService.isAuthenticated() ? '/protected/home' : '/intro';
    },
    pathMatch: 'full'
  },
  {path: 'intro', component: IntroComponent},
  {path: 'policy', component: PolicyComponent},
  {path: 'marq', component: MarqueeComponent},
  {
    path: 'protected',
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
      {path: 'anthology', component: AnthologyComponent},
      {path: 'collections/:id', component: CollectionsComponent},
      {path: 'payment-success', component: PaymentSuccessComponent},
      {
        path: 'account',
        children: [
          {path: '', redirectTo: 'profile', pathMatch: 'full'},
          {path: 'profile', component: ProfileComponent},
          {path: 'order-list', component: OrderListComponent},
        ]
      },
    ]
  },
  {
    path: 'administrator',
    canActivate: [AdminGuard],
    children: [
      {path: '', redirectTo: 'panel', pathMatch: 'full'},
      {path: 'panel', component: AdminPanelComponent},
      {path: '**', redirectTo: '/protected/home'},
    ]
  },
  {path: '**', redirectTo: '/protected/home'},
];
