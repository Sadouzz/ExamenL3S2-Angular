import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceStore } from '../../state/balance-store';
import { WalletApiService } from '../../services/wallet-api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',

  styleUrl: './login.component.css'
})
export class LoginComponent {
  phone = '';
  private router = inject(Router);
  private balanceStore = inject(BalanceStore);
  private api = inject(WalletApiService);
  private toast = inject(ToastService);

  loginAsClient() {
    if (this.phone.trim()) {
      const p = this.phone.trim();
      this.api.getWalletByPhone(p).subscribe({
        next: (wallet) => {
          this.balanceStore.setClient(p);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          // Toast will be shown by http-error.interceptor (or we can show custom)
          // The interceptor might say "404 Not Found" which is not super friendly but works.
        }
      });
    }
  }

  loginAsAgent() {
    this.balanceStore.setAgent(); 
    this.router.navigate(['/admin/wallets']);
  }
}
