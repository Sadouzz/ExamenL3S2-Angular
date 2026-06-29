import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingApiService, Bill } from '../../../core/services/billing-api.service';
import { BalanceStore } from '../../../core/state/balance-store';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderService } from '../../../shared/loader/loader.service';
import { XofPipe } from '../../../shared/pipes/xof.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, XofPipe],
  templateUrl: './bills.component.html',

  styleUrl: './bills.component.css'
})
export class BillsComponent implements OnInit {
  private api = inject(BillingApiService);
  private balanceStore = inject(BalanceStore);
  private toast = inject(ToastService);
  loader = inject(LoaderService);

  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  selectedBills: number[] = [];
  providers: string[] = [];
  filterProvider: string = 'ALL';

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    const phone = this.balanceStore.currentPhone();
    if (!phone) return;

    this.loader.show();
    this.api.getUnpaidBills(phone)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (data) => {
          this.bills = data || [];
          this.providers = [...new Set(this.bills.map(b => b.provider))];
          this.selectedBills = [];
          this.applyFilters();
        },
        error: (err) => console.error(err)
      });
  }

  applyFilters() {
    if (this.filterProvider === 'ALL') {
      this.filteredBills = [...this.bills];
    } else {
      this.filteredBills = this.bills.filter(b => b.provider === this.filterProvider);
    }
  }

  isOverdue(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  isSelected(id: number): boolean {
    return this.selectedBills.includes(id);
  }

  toggleSelection(id: number) {
    if (this.isSelected(id)) {
      this.selectedBills = this.selectedBills.filter(billId => billId !== id);
    } else {
      this.selectedBills.push(id);
    }
  }

  isAllSelected(): boolean {
    return this.filteredBills.length > 0 && 
           this.filteredBills.every(b => this.selectedBills.includes(b.id));
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      // Add all filtered bills to selection, keeping existing ones
      const filteredIds = this.filteredBills.map(b => b.id);
      this.selectedBills = [...new Set([...this.selectedBills, ...filteredIds])];
    } else {
      // Remove all filtered bills from selection
      const filteredIds = this.filteredBills.map(b => b.id);
      this.selectedBills = this.selectedBills.filter(id => !filteredIds.includes(id));
    }
  }

  getTotalAmount(): number {
    return this.bills
      .filter(b => this.selectedBills.includes(b.id))
      .reduce((sum, bill) => sum + bill.amount, 0);
  }

  paySelectedBills() {
    if (this.selectedBills.length === 0) return;

    const phone = this.balanceStore.currentPhone()!;
    this.loader.show();
    
    this.api.payBills(phone, this.selectedBills)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Factures payées avec succès !');
          this.loadBills();
          this.balanceStore.refresh();
        },
        error: () => {}
      });
  }
}
