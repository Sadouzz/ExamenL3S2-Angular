import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletApiService, Transaction } from '../../../core/services/wallet-api.service';
import { BalanceStore } from '../../../core/state/balance-store';
import { XofPipe } from '../../../shared/pipes/xof.pipe';
import { LoaderService } from '../../../shared/loader/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, XofPipe],
  templateUrl: './transactions.component.html',

  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {
  private api = inject(WalletApiService);
  private balanceStore = inject(BalanceStore);
  private loader = inject(LoaderService);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterType: string = 'ALL';

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    const phone = this.balanceStore.currentPhone();
    if (!phone) return;

    this.loader.show();
    this.api.getTransactions(phone)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (data) => {
          this.transactions = data || [];
          this.applyFilters();
        },
        error: (err) => console.error(err)
      });
  }

  filterDate: string = '';

  applyFilters() {
    let filtered = [...this.transactions];

    if (this.filterType !== 'ALL') {
      filtered = filtered.filter(t => t.type === this.filterType);
    }

    if (this.filterDate) {
      const selectedDate = new Date(this.filterDate).toISOString().split('T')[0];
      filtered = filtered.filter(t => {
        const txDate = new Date(t.date).toISOString().split('T')[0];
        return txDate === selectedDate;
      });
    }

    this.filteredTransactions = filtered;
  }
}
