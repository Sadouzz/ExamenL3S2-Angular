import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { ToastComponent } from './shared/toast/toast.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { BalanceStore } from './core/state/balance-store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'badwallet-dashboard';
  private router = inject(Router);
  
  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}
