import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
}

@Component({
  standalone: true,
  templateUrl: './home.html',
  imports: [RouterLink],
})
export class Home implements AfterViewInit {

  private isBrowser = false;
  wishlist: WishlistItem[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cartService: CartService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.wishlist = JSON.parse(
        localStorage.getItem('wishlist') || '[]'
      );
    }
  }

  /* =========================
     CART
  ========================== */
  addToCartFromHome(food: {
    foodId: number;
    name: string;
    basePrice: number;
  }) {
    this.cartService.addToCart({
      foodId: food.foodId,
      name: food.name,
      basePrice: food.basePrice,
      addons: [],
      quantity: 1,
      totalPrice: food.basePrice,
    });
  }

  /* =========================
     WISHLIST (FIXED)
  ========================== */
  toggleWishlist(item: WishlistItem) {
    if (!this.isBrowser) return;

    const index = this.wishlist.findIndex(i => i.id === item.id);

    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(item);
    }

    localStorage.setItem(
      'wishlist',
      JSON.stringify(this.wishlist)
    );
  }

  isWishlisted(id: number): boolean {
    return this.wishlist.some(item => item.id === id);
  }

  /* =========================
     SCROLL ANIMATIONS
  ========================== */
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const elements =
        document.querySelectorAll('.animate-on-scroll');

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-show');
          }
        });
      });

      elements.forEach(el => observer.observe(el));
    }, 0);
  }
}