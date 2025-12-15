import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  addToCart(item: CartItem) {
    const items = this.cartItems.value;
    this.cartItems.next([...items, item]);
  }

  increaseQty(index: number) {
    const items = [...this.cartItems.value];
    items[index].quantity++;
    this.cartItems.next(items);
  }

  decreaseQty(index: number) {
    const items = [...this.cartItems.value];
    if (items[index].quantity > 1) {
      items[index].quantity--;
    }
    this.cartItems.next(items);
  }

  removeItem(index: number) {
    const items = [...this.cartItems.value];
    items.splice(index, 1);
    this.cartItems.next(items);
  }

  clearCart() {
    this.cartItems.next([]);
  }
}
