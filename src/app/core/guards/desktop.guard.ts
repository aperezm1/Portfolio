import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';
import { PortfolioDataService } from '../services/portfolio-data.service';

export const desktopGuard: CanActivateFn = () => {
  const session = inject(UserSessionService);
  const router = inject(Router);
  const data = inject(PortfolioDataService);

  const allowed = Boolean(session.getUserName().trim());
  if (!allowed) return router.createUrlTree(['/login']);

  data.init();
  return true;
};