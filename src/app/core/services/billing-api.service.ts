import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.http.get<any[]>(`${this.BASE}/${phone}/current`).pipe(
      map(data => data.map((item, index) => ({
        id: index, // backend doesn't return id
        provider: item.serviceName,
        amount: item.amount,
        dueDate: item.dueDate,
        isPaid: false,
        reference: item.reference
      })))
    );
  }

  getHistory(phone: string, debut: string, fin: string): Observable<Bill[]> {
    return this.http.get<any[]>(`${this.BASE}/${phone}/periode?debut=${debut}&fin=${fin}`).pipe(
      map(data => data.map((item, index) => ({
        id: index,
        provider: item.serviceName,
        amount: item.amount,
        dueDate: item.dueDate,
        isPaid: true,
        reference: item.reference
      })))
    );
  }

  payBills(phone: string, billIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.WALLET_BASE}/pay-factures`, { phoneNumber: phone, factureReferences: billIds });
  }
}
