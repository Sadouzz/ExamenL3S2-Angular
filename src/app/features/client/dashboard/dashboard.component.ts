import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceStore } from '../../../core/state/balance-store';
import { WalletApiService } from '../../../core/services/wallet-api.service';
import { XofPipe } from '../../../shared/pipes/xof.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, XofPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  balanceStore = inject(BalanceStore);
  api = inject(WalletApiService);

  monthlyRevenue = 0;
  monthlyExpense = 0;

  ngOnInit() {
    const phone = this.balanceStore.currentPhone();
    if (phone) {
      this.api.getTransactions(phone).subscribe({
        next: (transactions) => {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
              if (tx.type === 'DEPOSIT') {
                this.monthlyRevenue += tx.amount;
              } else {
                this.monthlyExpense += tx.amount;
              }
            }
          });
        },
        error: (err) => {
          // Ignore error gracefully so it doesn't crash the console
          console.warn('Erreur lors du chargement des transactions:', err);
        }
      });
    }
  }
}
