import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bill {
  id: number;
  provider: string; // WOYAFAL, ISM, SENELEC...
  amount: number;
  dueDate: string;
  isPaid: boolean;
  reference: string;
}

@Injectable({ providedIn: 'root' })
export class BillingApiService {
  private readonly BASE = '/api/external/factures';
  private readonly WALLET_BASE = '/api/wallets';
  private http = inject(HttpClient);

  getUnpaidBills(phone: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.BASE}/unpaid/${phone}`);
  }

  getHistory(phone: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.BASE}/history/${phone}`);
  }

  payBills(phone: string, billIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.WALLET_BASE}/pay-factures`, { phone, billIds });
  }
}
