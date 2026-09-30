import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast-service';

export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const toast = inject(ToastService);
  const router = inject(Router);
  
  if (accountService.currentUser()) return true;
  else {
    toast.error('You are not authorized to access this page');
    router.navigateByUrl('/');
    return false;
  }
};
