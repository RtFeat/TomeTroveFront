import { Routes } from '@angular/router';
import {HomeComponent} from './protected/home/home.component';
import {IntroComponent} from './intro/intro.component';
import {AuthGuard} from './auth/shared/service/auth.guard';
import {AnthologyComponent} from './protected/anthology/anthology.component';
import {AuthService} from './auth/shared/service/auth.service';
import {inject} from '@angular/core';
import {MarqueeComponent} from './shared/marquee/marquee.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ()=> {
      const authService = inject(AuthService);
      return authService.isAuthenticated() ? '/protected/home' : '/intro';
    },
    pathMatch: 'full'
  },
  { path: 'intro', component: IntroComponent },
  { path: 'marq', component: MarqueeComponent },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'anthology', component: AnthologyComponent},
    ]
  },
  { path: '**', redirectTo: '/home'},
];
