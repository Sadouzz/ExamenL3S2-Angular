import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BalanceStore } from '../../state/balance-store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent {
  private router = inject(Router);
  public balanceStore = inject(BalanceStore);

  logout() {
    this.balanceStore.clear();
    this.router.navigate(['/login']);
  }
}
