import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
}

@Component({
  standalone: true,
  templateUrl: './wishlist.html',
  imports: [CommonModule], // ✅ REQUIRED for *ngIf, *ngFor
})
export class Wishlist {

  wishlist: WishlistItem[] = [];
  private isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cartService: CartService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loadWishlist();
    }
  }

  loadWishlist() {
    this.wishlist = JSON.parse(
      localStorage.getItem('wishlist') || '[]'
    );
  }

  remove(id: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  addToCart(item: WishlistItem) {
  // 1️⃣ Add to cart
  this.cartService.addToCart({
    foodId: item.id,
    name: item.name,
    basePrice: item.price,
    addons: [],
    quantity: 1,
    totalPrice: item.price,
  });

  // 2️⃣ Remove from wishlist immediately
  this.remove(item.id);
}
}