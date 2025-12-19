import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';
import { Food } from '../../models/food';
import { Addon } from '../../models/addon';

type FoodType = 'veg' | 'egg' | 'nonveg';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
})
export class Menu {
  isBrowser = false;

  /* =========================
     FILTER STATE
  ========================== */
  selectedType: 'all' | FoodType = 'all';

  /* =========================
     MENU DATA
  ========================== */
  foods: (Food & {
    image: string;
    type: FoodType;
    defaultAddonIds: number[];
  })[] = [
    {
      id: 1,
      name: 'Moong Sprouts Bowl',
      basePrice: 80,
      category: 'sprouts',
      type: 'veg',
      image: 'https://images.unsplash.com/photo-1540420828642-fca2c5c18abe',
      defaultAddonIds: [1, 2, 3],
      addons: [
        { id: 1, name: 'Onion', price: 0 },
        { id: 2, name: 'Tomato', price: 0 },
        { id: 3, name: 'Cucumber', price: 0 },
      ],
    },
    {
      id: 2,
      name: 'Chana Sprouts Bowl',
      basePrice: 90,
      category: 'sprouts',
      type: 'veg',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      defaultAddonIds: [1, 2, 3],
      addons: [
        { id: 1, name: 'Onion', price: 0 },
        { id: 2, name: 'Tomato', price: 0 },
        { id: 3, name: 'Cucumber', price: 0 },
      ],
    },
    {
      id: 3,
      name: 'Mixed Sprouts Bowl',
      basePrice: 100,
      category: 'sprouts',
      type: 'veg',
      image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b',
      defaultAddonIds: [1, 2, 3],
      addons: [
        { id: 1, name: 'Onion', price: 0 },
        { id: 2, name: 'Tomato', price: 0 },
        { id: 3, name: 'Cucumber', price: 0 },
      ],
    },
    {
      id: 4,
      name: 'Paneer Sprouts Bowl',
      basePrice: 120,
      category: 'sprouts',
      type: 'veg',
      image: 'https://images.unsplash.com/photo-1604908177522-432c2b5c7d6f',
      defaultAddonIds: [1, 2, 3],
      addons: [
        { id: 1, name: 'Onion', price: 0 },
        { id: 2, name: 'Tomato', price: 0 },
        { id: 3, name: 'Cucumber', price: 0 },
      ],
    },
    {
      id: 5,
      name: 'Egg Meal Bowl',
      basePrice: 130,
      category: 'sprouts',
      type: 'egg',
      image: 'https://images.unsplash.com/photo-1604908177093-0f0dbe3cfc0c',
      defaultAddonIds: [1, 2, 3, 4],
      addons: [
        { id: 1, name: 'Onion', price: 0 },
        { id: 2, name: 'Tomato', price: 0 },
        { id: 3, name: 'Cucumber', price: 0 },
        { id: 4, name: 'Capsicum', price: 0 },
      ],
    },
    {
      id: 6,
      name: 'Air Fried Chicken Bowl',
      basePrice: 160,
      category: 'airfried',
      type: 'nonveg',
      image: 'https://images.unsplash.com/photo-1604908811849-4c4f1b03d92f',
      defaultAddonIds: [1, 4],
      addons: [
        { id: 1, name: 'Onion', price: 0 },
        { id: 4, name: 'Capsicum', price: 0 },
      ],
    },
  ];

  /* =========================
     MODAL STATE
  ========================== */
  showAddonModal = false;
  selectedFood!: (Food & { defaultAddonIds: number[] });
  modalSelectedAddons: Addon[] = [];
  modalTotal = 0;

  /* =========================
     WISHLIST
  ========================== */
  wishlist: { id: number; name: string; basePrice: number }[] = [];

  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    }
  }

  /* =========================
     FILTER
  ========================== */
  get filteredFoods() {
    if (this.selectedType === 'all') return this.foods;
    return this.foods.filter(f => f.type === this.selectedType);
  }

  /* =========================
     WISHLIST
  ========================== */
  toggleWishlist(food: Food) {
    const i = this.wishlist.findIndex(w => w.id === food.id);
    i > -1
      ? this.wishlist.splice(i, 1)
      : this.wishlist.push({ id: food.id, name: food.name, basePrice: food.basePrice });

    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isWishlisted(id: number) {
    return this.wishlist.some(w => w.id === id);
  }

  /* =========================
     ADDON MODAL
  ========================== */
  openAddonPopup(food: any) {
    this.selectedFood = food;
    this.modalSelectedAddons = food.addons.filter((a: Addon) =>
      food.defaultAddonIds.includes(a.id)
    );
    this.calculateTotal();
    this.showAddonModal = true;
  }

  closeAddonPopup() {
    this.showAddonModal = false;
  }

  toggleAddon(addon: Addon) {
    const i = this.modalSelectedAddons.findIndex(a => a.id === addon.id);
    i > -1
      ? this.modalSelectedAddons.splice(i, 1)
      : this.modalSelectedAddons.push(addon);
    this.calculateTotal();
  }

  isAddonSelected(id: number): boolean {
    return this.modalSelectedAddons.some(a => a.id === id);
  }

  calculateTotal() {
    this.modalTotal =
      this.selectedFood.basePrice +
      this.modalSelectedAddons.reduce((s, a) => s + a.price, 0);
  }

  confirmAddToCart() {
    this.cartService.addToCart({
      foodId: this.selectedFood.id,
      name: this.selectedFood.name,
      basePrice: this.selectedFood.basePrice,
      addons: this.modalSelectedAddons,
      quantity: 1,
      totalPrice: this.modalTotal,
    });
    this.closeAddonPopup();
  }
}