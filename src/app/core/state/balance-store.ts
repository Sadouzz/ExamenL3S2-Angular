import { Injectable, signal, inject } from '@angular/core';
import { WalletApiService } from '../services/wallet-api.service';

@Injectable({ providedIn: 'root' })
export class BalanceStore {
  private api = inject(WalletApiService);
  
  readonly balance = signal<number>(0);
  readonly currentPhone = signal<string | null>(null);
  readonly isAgent = signal<boolean>(false);

  setClient(phone: string) {
    this.currentPhone.set(phone);
    this.isAgent.set(false);
    this.refresh();
  }

  setAgent() {
    this.currentPhone.set(null);
    this.balance.set(0);
    this.isAgent.set(true);
  }

  refresh() {
    const phone = this.currentPhone();
    if (phone) {
      this.api.getBalance(phone).subscribe({
        next: (b) => this.balance.set(b),
        error: () => this.balance.set(0)
      });
    }
  }

  clear() {
    this.currentPhone.set(null);
    this.balance.set(0);
  }
}
