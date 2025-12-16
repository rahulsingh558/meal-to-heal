import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart';
import { CartItem } from '../../models/cart-item';
import { Food } from '../../models/food';
import { Addon } from '../../models/addon';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
})
export class Menu {
  constructor(private cartService: CartService) {}

  // -------------------------------
  // MENU DATA
  // -------------------------------
  foods: Food[] = [
    {
      id: 1,
      name: 'Sprouts Bowl',
      basePrice: 80,
      category: 'sprouts',
      description: 'Fresh mixed sprouts with lemon',
      addons: [
        { id: 1, name: 'Corn', price: 20 },
        { id: 2, name: 'Paneer', price: 30 },
      ],
    },
    {
      id: 2,
      name: 'Protein Sprouts',
      basePrice: 100,
      category: 'sprouts',
      description: 'High-protein sprouts bowl',
      addons: [
        { id: 1, name: 'Corn', price: 20 },
        { id: 2, name: 'Paneer', price: 30 },
        { id: 3, name: 'Boiled Egg', price: 25 },
      ],
    },
    {
      id: 3,
      name: 'Air Fried Paneer',
      basePrice: 150,
      category: 'airfried',
      description: 'Crispy paneer, air fried',
      addons: [
        { id: 4, name: 'Extra Paneer', price: 40 },
        { id: 5, name: 'Cheese Dip', price: 25 },
      ],
    },
    {
      id: 4,
      name: 'Air Fried Chicken',
      basePrice: 180,
      category: 'airfried',
      description: 'Juicy air-fried chicken',
      addons: [
        { id: 6, name: 'Extra Chicken', price: 50 },
        { id: 5, name: 'Cheese Dip', price: 25 },
      ],
    },
  ];

  // -------------------------------
  // ADDON STATE
  // -------------------------------
  selectedAddons: Record<number, Addon[]> = {};

  toggleAddon(foodId: number, addon: Addon) {
    const selected = this.selectedAddons[foodId] || [];
    const exists = selected.some(a => a.id === addon.id);

    this.selectedAddons[foodId] = exists
      ? selected.filter(a => a.id !== addon.id)
      : [...selected, addon];
  }

  // -------------------------------
  // PRICE CALCULATION
  // -------------------------------
  getTotalPrice(food: Food): number {
    const addons = this.selectedAddons[food.id] || [];
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    return food.basePrice + addonsTotal;
  }

  // -------------------------------
  // ADD TO CART
  // -------------------------------
  addToCart(food: Food) {
    const addons = this.selectedAddons[food.id] || [];

    const item: CartItem = {
      foodId: food.id,
      name: food.name,
      basePrice: food.basePrice,
      addons,
      quantity: 1,
      totalPrice: this.getTotalPrice(food),
    };

    this.cartService.addToCart(item);

    // Reset addons after add
    this.selectedAddons[food.id] = [];

    console.log('✅ Added to cart:', item);
  }
}
