import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (_route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // ✅ Always allow during SSR
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    // ✅ Save the URL user wanted to visit
    localStorage.setItem('redirectAfterLogin', state.url);

    router.navigate(['/login']);
    return false;
  }

  return true;
};