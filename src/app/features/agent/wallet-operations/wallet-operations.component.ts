import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletApiService, Wallet } from '../../../core/services/wallet-api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-wallet-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-operations.component.html',

  styleUrl: './wallet-operations.component.css'
})
export class WalletOperationsComponent {
  @Input() wallet!: Wallet;
  @Output() close = new EventEmitter();
  @Output() done = new EventEmitter();
  
  private api = inject(WalletApiService);
  private toast = inject(ToastService);

  type: 'DEPOSIT' | 'WITHDRAW' = 'DEPOSIT';
  amount: number = 0;

  submit() {
    if (!this.wallet.id) return;
    const req = this.type === 'DEPOSIT' 
      ? this.api.deposit(this.wallet.id, this.amount)
      : this.api.withdraw(this.wallet.phoneNumber, this.amount);
      
    req.subscribe({
      next: () => {
        this.toast.showSuccess(`Opération réussie !`);
        this.done.emit();
        this.close.emit();
      }
    });
  }
}
