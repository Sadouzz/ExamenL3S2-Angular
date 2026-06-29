import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent) },
  // Client Routes
  { path: 'dashboard', loadComponent: () => import('./features/client/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'transfer', loadComponent: () => import('./features/client/transfer/transfer.component').then(m => m.TransferComponent) },
  { path: 'transactions', loadComponent: () => import('./features/client/transactions/transactions.component').then(m => m.TransactionsComponent) },
  { path: 'bills', loadComponent: () => import('./features/client/bills/bills.component').then(m => m.BillsComponent) },
  // Agent Routes
  { path: 'admin/wallets', loadComponent: () => import('./features/agent/wallets-list/wallets-list.component').then(m => m.WalletsListComponent) },
  // Default Routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
