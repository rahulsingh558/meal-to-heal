import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  imports: [CommonModule],   // 👈 STEP 3 IS HERE
  templateUrl: './checkout.html',
})
export class Checkout {

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  placeOrder() {
    // Clear cart after placing order
    this.cartService.clearCart();

    // Navigate to order summary
    this.router.navigate(['/order-summary']);
  }
}
