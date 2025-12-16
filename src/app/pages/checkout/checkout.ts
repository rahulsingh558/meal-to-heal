import { Component } from '@angular/core';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './checkout.html',
})
export class Checkout {
  name = '';
  phone = '';
  address = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  placeOrder() {
    this.cartService.cart$.pipe(take(1)).subscribe(items => {
      if (items.length === 0) {
        alert('Cart is empty');
        return;
      }

      const orderPayload = {
        items: items.map(i => ({
          foodId: i.foodId,
          name: i.name,
          basePrice: i.basePrice,
          quantity: i.quantity,
        })),
        customer: {
          name: this.name,
          phone: this.phone,
          address: this.address,
        },
      };

      this.orderService.placeOrder(orderPayload).subscribe({
        next: res => {
          alert(`Order placed successfully! Order ID: ${res.orderId}`);
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        error: err => {
          console.error(err);
          alert('Failed to place order');
        },
      });
    });
  }
}
