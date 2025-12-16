import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  standalone: true,
  templateUrl: './home.html',

  // Routing directives for routerLink buttons
  imports: [RouterLink],
})
export class Home implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService
  ) {}

  /**
   * Add item to cart from Home page
   * (No addons on home page)
   */
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

  /**
   * Scroll animations (browser-only)
   */
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-show');
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach(el => observer.observe(el));
    }, 0);
  }
}
