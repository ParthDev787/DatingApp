import { HttpEvent, HttpInterceptorFn, HttpParams, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpResponse<unknown>>();

export const invalidateCache = (urlPattern: string) => {
  for (const key of cache.keys()) {
    if (key.includes(urlPattern)) {
      cache.delete(key);
      console.log(`Cache invalidated for: ${key}`);
    }
  }
};

export const clearHttpCache = () => {
  cache.clear();
};

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  };

  const cacheKey = generateCacheKey(req.url, req.params);

  // Invalidate cache on mutations
  if (req.method !== 'GET') {
    if (req.url.includes('/likes')) invalidateCache('/likes');
    if (req.url.includes('/messages')) invalidateCache('/messages');
    if (req.url.includes('/members')) invalidateCache('/members');
  }

  // Only cache GET requests for member catalog (do not cache dynamic likes, messages, or user state)
  const isCacheable = req.method === 'GET' && req.url.includes('/members') && !req.url.includes('/members/add-photo');

  if (isCacheable) {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(event => {
      if (isCacheable && event instanceof HttpResponse) {
        cache.set(cacheKey, event);
      }
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
