import { Component, inject } from '@angular/core';
import { BalanceStore } from '../../state/balance-store';
import { XofPipe } from '../../../shared/pipes/xof.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, XofPipe],
  templateUrl: './header.component.html',

  styleUrl: './header.component.css'
})
export class HeaderComponent {
  balanceStore = inject(BalanceStore);
}
