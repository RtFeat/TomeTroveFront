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
        apiUrl: 'https://tometrove.ru/api', // URL для API
        staticUrl: 'https://tometrove.ru', // URL для API
        mediaUrl: 'https://tometrove.ru/media/' // URL для медиафайлов
      } as AppConfig
    }
  ]
};
