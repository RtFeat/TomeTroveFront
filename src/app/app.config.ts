import { ApplicationConfig, provideZoneChangeDetection, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export interface AppConfig {
  apiUrl: string;
  staticUrl: string;
  mediaUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('AppConfig');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'your', // URL для API
        staticUrl: 'your', // URL для API
        mediaUrl: 'your' // URL для медиафайлов
      } as AppConfig
    }
  ]
};
