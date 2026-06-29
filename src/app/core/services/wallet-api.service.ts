import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Wallet {
  id?: number;
  email: string;
  phoneNumber: string;
  currentBalance: number;
  initialBalance?: number;
  currency?: string;
}

export interface TransferDto {
  destination: string;
  amount: number;
  description?: string;
}

export interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';
  amount: number;
  eventDate: string;
  description?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class WalletApiService {
  private readonly BASE = '/api/wallets';
  private http = inject(HttpClient);

  getWallets(page: number = 0, size: number = 10): Observable<Page<Wallet>> {
    return this.http.get<Page<Wallet>>(`${this.BASE}?page=${page}&size=${size}`);
  }

  createWallet(wallet: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(this.BASE, wallet);
  }

  getWalletByPhone(phone: string): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.BASE}/${phone}`);
  }

  getBalance(phone: string): Observable<number> {
    return this.http.get<number>(`${this.BASE}/${phone}/balance`);
  }

  deposit(id: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.BASE}/${id}/deposit`, { amount });
  }

  withdraw(phoneNumber: string, amount: number): Observable<void> {
    return this.http.post<void>(`${this.BASE}/withdraw`, { phoneNumber, amount });
  }

  transfer(senderPhone: string, payload: TransferDto): Observable<void> {
    const backendPayload = {
      senderPhone: senderPhone,
      receiverPhone: payload.destination,
      amount: payload.amount
    };
    return this.http.post<void>(`${this.BASE}/transfer`, backendPayload);
  }

  getTransactions(phone: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.BASE}/${phone}/transactions`);
  }
}
