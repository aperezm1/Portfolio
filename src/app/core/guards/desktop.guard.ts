import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';

export const desktopGuard: CanActivateFn = () => {
  const session = inject(UserSessionService);
  const router = inject(Router);

  return session.getUserName().trim() ? true : router.createUrlTree(['/login']);
};