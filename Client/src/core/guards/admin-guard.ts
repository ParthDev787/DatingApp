import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);
  const router = inject(Router);

  if (accountService.currentUser()?.roles.includes('Admin') 
    || accountService.currentUser()?.roles.includes('Moderator')) {
      return true;
  } else {
    toast.error('Enter this area, you cannot');
    router.navigateByUrl('/');
    return false;
  }
};
