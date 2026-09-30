import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InitService } from '../core/services/init-service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { errorInterceptor } from '../core/interceptor/error-interceptor';
import { jWTInterceptor } from '../core/interceptor/jwt-interceptor';
import { loadingInterceptor } from '../core/interceptor/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor, jWTInterceptor, loadingInterceptor])),
    provideAppInitializer(async () => {
      const initService = inject(InitService);

      try {
        await lastValueFrom(initService.init());
      } finally {
        const splash = document.getElementById('initial-splash');
        if (splash) splash.remove();
      }
    }),
  ],
};
