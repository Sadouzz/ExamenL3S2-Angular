import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletApiService } from '../../../core/services/wallet-api.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { phoneValidator } from '../../../shared/validators/phone.validator';

@Component({
  selector: 'app-wallet-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-create.component.html',

  styleUrl: './wallet-create.component.css'
})
export class WalletCreateComponent {
  @Output() close = new EventEmitter();
  @Output() created = new EventEmitter();
  
  private fb = inject(FormBuilder);
  private api = inject(WalletApiService);
  private toast = inject(ToastService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, phoneValidator()]],
    initialBalance: [0]
  });

  submit() {
    if (this.form.invalid) return;
    this.api.createWallet(this.form.value as any).subscribe({
      next: () => {
        this.toast.showSuccess('Portefeuille créé avec succès !');
        this.created.emit();
        this.close.emit();
      }
    });
  }
}
