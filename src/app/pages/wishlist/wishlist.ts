import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.html',
})
export class Wishlist {
  isBrowser = false;

  wishlist: {
    id: number;
    name: string;
    basePrice: number;
  }[] = [];

  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.wishlist = JSON.parse(
        localStorage.getItem('wishlist') || '[]'
      );
    }
  }

  addToCart(item: {
    id: number;
    name: string;
    basePrice: number;
  }) {
    this.cartService.addToCart({
      foodId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      addons: [],
      quantity: 1,
      totalPrice: item.basePrice,
    });

    // ✅ remove from wishlist automatically
    this.remove(item.id);
  }

  remove(id: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== id);

    if (this.isBrowser) {
      localStorage.setItem(
        'wishlist',
        JSON.stringify(this.wishlist)
      );
    }
  }
}