import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WalletApiService } from '../../../core/services/wallet-api.service';
import { BalanceStore } from '../../../core/state/balance-store';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderService } from '../../../shared/loader/loader.service';
import { phoneValidator, differentPhoneValidator } from '../../../shared/validators/phone.validator';
import { finalize } from 'rxjs/operators';
import { XofPipe } from '../../../shared/pipes/xof.pipe';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, XofPipe],
  templateUrl: './transfer.component.html',

  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  private fb = inject(FormBuilder);
  private api = inject(WalletApiService);
  balanceStore = inject(BalanceStore);
  private toast = inject(ToastService);
  loader = inject(LoaderService);

  ngOnInit() {
    const currentPhone = this.balanceStore.currentPhone() || '';
    
    this.transferForm = this.fb.group({
      destination: ['', [Validators.required, phoneValidator()]],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: ['']
    }, { validators: differentPhoneValidator(currentPhone) });

    this.transferForm.get('amount')?.valueChanges.subscribe(val => {
      if (val > this.balanceStore.balance()) {
        this.transferForm.get('amount')?.setErrors({ insufficient: true });
      } else {
        const errors = this.transferForm.get('amount')?.errors;
        if (errors) {
          delete errors['insufficient'];
          if (Object.keys(errors).length === 0) {
            this.transferForm.get('amount')?.setErrors(null);
          } else {
            this.transferForm.get('amount')?.setErrors(errors);
          }
        }
      }
    });
  }

  onSubmit() {
    if (this.transferForm.invalid) return;

    this.loader.show();
    const payload = this.transferForm.value;
    const senderPhone = this.balanceStore.currentPhone()!;

    this.api.transfer(senderPhone, payload)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Transfert effectué avec succès !');
          this.transferForm.reset();
          this.balanceStore.refresh();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
