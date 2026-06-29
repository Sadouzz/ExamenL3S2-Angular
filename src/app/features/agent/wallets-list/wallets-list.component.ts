import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletApiService, Wallet } from '../../../core/services/wallet-api.service';
import { LoaderService } from '../../../shared/loader/loader.service';
import { XofPipe } from '../../../shared/pipes/xof.pipe';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { WalletCreateComponent } from '../wallet-create/wallet-create.component';
import { WalletOperationsComponent } from '../wallet-operations/wallet-operations.component';

@Component({
  selector: 'app-wallets-list',
  standalone: true,
  imports: [CommonModule, XofPipe, FormsModule, WalletCreateComponent, WalletOperationsComponent],
  templateUrl: './wallets-list.component.html',

  styleUrl: './wallets-list.component.css'
})
export class WalletsListComponent implements OnInit {
  private api = inject(WalletApiService);
  private loader = inject(LoaderService);

  wallets: Wallet[] = [];
  currentPage = 0;
  totalPages = 0;
  searchPhone = '';
  
  showCreateModal = false;
  selectedWallet: Wallet | null = null;

  ngOnInit() {
    this.loadPage(0);
  }

  loadPage(page: number) {
    this.loader.show();
    this.api.getWallets(page, 10)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (data) => {
          this.wallets = data.content || [];
          this.currentPage = data.number;
          this.totalPages = data.totalPages;
        },
        error: (err) => console.error(err)
      });
  }

  refreshCurrentPage() {
    if (this.searchPhone.trim()) {
      this.searchWallet();
    } else {
      this.loadPage(this.currentPage);
    }
  }

  searchWallet() {
    if (!this.searchPhone.trim()) {
      this.loadPage(0);
      return;
    }
    this.loader.show();
    this.api.getWalletByPhone(this.searchPhone)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (wallet) => {
          this.wallets = wallet ? [wallet] : [];
          this.totalPages = 1;
          this.currentPage = 0;
        },
        error: () => {
          this.wallets = [];
          this.totalPages = 1;
        }
      });
  }
}
