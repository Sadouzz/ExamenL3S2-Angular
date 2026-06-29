import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceStore } from '../../state/balance-store';

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

  loginAsClient() {
    if (this.phone.trim()) {
      this.balanceStore.setClient(this.phone.trim());
      this.router.navigate(['/dashboard']);
    }
  }

  loginAsAgent() {
    this.balanceStore.setAgent(); 
    this.router.navigate(['/admin/wallets']);
  }
}
