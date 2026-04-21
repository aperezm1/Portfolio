import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';
import { AppStateService } from '../services/app-state.service';
import { ClippyChatService } from '../services/clippy-chat.service';

export const desktopGuard: CanActivateFn = () => {
  const session = inject(UserSessionService);
  const router = inject(Router);
  const appState = inject(AppStateService);
  const chat = inject(ClippyChatService);

  const allowed = Boolean(session.getUserName().trim());
  if (!allowed) return router.createUrlTree(['/login']);

  appState.init();
  chat.connect();
  return true;
};