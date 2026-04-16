import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/boot-screen/boot-screen.component').then((m) => m.BootScreenComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'desktop',
    loadComponent: () =>
      import('./pages/desktop/desktop.component').then((m) => m.DesktopComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];