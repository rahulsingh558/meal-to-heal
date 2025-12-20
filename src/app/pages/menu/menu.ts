import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';
import { MenuAdminService, AdminMenuItem } from '../../services/menu-admin.service';
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

  selectedType: 'all' | FoodType = 'all';

  foods: (Food & {
    image: string;
    type: FoodType;
    defaultAddonIds: number[];
  })[] = [];

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
    private adminMenu: MenuAdminService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.wishlist = JSON.parse(
        localStorage.getItem('wishlist') || '[]'
      );
      this.loadMenu();
    }
  }

  /* =========================
     LOAD MENU (ADMIN → USER)
  ========================== */
  loadMenu() {
    const adminItems = this.adminMenu.getAll();

    if (adminItems.length > 0) {
      this.foods = adminItems.map(item => this.mapAdminToFood(item));
    } else {
      this.foods = this.getFallbackMenu();
    }
  }

  /* =========================
     ADMIN → FOOD MAPPER
  ========================== */
  mapAdminToFood(item: AdminMenuItem): any {
  const allAddons = [
    ...item.defaultAddons,
    ...item.extraAddons,
  ];

  return {
    id: item.id,
    name: item.name,
    subtitle: item.subtitle || 'Healthy • Fresh • Protein-rich', // ✅
    basePrice: item.basePrice,
    category: 'sprouts',
    type: item.type,
    image: item.image,
    addons: allAddons,
    defaultAddonIds: item.defaultAddons.map(a => a.id),
  };
}

  /* =========================
     FALLBACK (OLD WORKING MENU)
  ========================== */
  getFallbackMenu(): any[] {
    return [
      {
        id: 1,
        name: 'Moong Sprouts Bowl',
        subtitle: 'Healthy • Fresh • Protein-rich',
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
    ];
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
      : this.wishlist.push({
          id: food.id,
          name: food.name,
          basePrice: food.basePrice,
        });

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

  isAddonSelected(id: number) {
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