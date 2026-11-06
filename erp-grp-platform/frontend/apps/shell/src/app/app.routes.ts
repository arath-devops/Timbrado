import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'erp',
    canActivate: [authGuard],
    loadChildren: () => import('./features/erp/erp.routes').then(m => m.ERP_ROUTES),
  },
  {
    path: 'grp',
    canActivate: [authGuard],
    loadChildren: () => import('./features/grp/grp.routes').then(m => m.GRP_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
