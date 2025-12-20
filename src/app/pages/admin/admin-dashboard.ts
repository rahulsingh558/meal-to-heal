import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MenuAdminService,
  AdminMenuItem,
} from '../../services/menu-admin.service';

import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  items: AdminMenuItem[] = [];

  /* =========================
     NEW ITEM FORM MODEL
  ========================== */
  newItem: Omit<AdminMenuItem, 'id'> = {
    name: '',
    subtitle: 'Healthy • Fresh • Protein-rich',
    basePrice: 0,
    type: 'veg',
    image: '',
    defaultAddons: [],
    extraAddons: [],
  };

  constructor(
    private menuService: MenuAdminService,
    private auth: AdminAuthService
  ) {
    /* =========================
       SEED MENU (RUNS ONCE)
    ========================== */
    this.menuService.seedIfEmpty([
      {
        id: 1,
        name: 'Moong Sprouts Bowl',
        subtitle: 'Healthy • Fresh • Protein-rich',
        basePrice: 80,
        type: 'veg',
        image:
          'https://images.unsplash.com/photo-1540420828642-fca2c5c18abe',
        defaultAddons: [
          { id: 1, name: 'Onion', price: 0 },
          { id: 2, name: 'Tomato', price: 0 },
          { id: 3, name: 'Cucumber', price: 0 },
        ],
        extraAddons: [],
      },

      {
        id: 2,
        name: 'Chana Sprouts Bowl',
        subtitle: 'Light • Fresh • Protein-rich',
        basePrice: 90,
        type: 'veg',
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        defaultAddons: [
          { id: 1, name: 'Onion', price: 0 },
          { id: 2, name: 'Tomato', price: 0 },
          { id: 3, name: 'Cucumber', price: 0 },
        ],
        extraAddons: [],
      },

      {
        id: 3,
        name: 'Egg Meal Bowl',
        subtitle: 'High Protein • Power Meal',
        basePrice: 130,
        type: 'egg',
        image:
          'https://images.unsplash.com/photo-1604908177093-0f0dbe3cfc0c',
        defaultAddons: [
          { id: 1, name: 'Onion', price: 0 },
          { id: 2, name: 'Tomato', price: 0 },
          { id: 3, name: 'Cucumber', price: 0 },
          { id: 4, name: 'Capsicum', price: 0 },
        ],
        extraAddons: [],
      },
    ]);

    this.loadItems();
  }

  /* =========================
     LOAD
  ========================== */
  loadItems() {
    this.items = this.menuService.getAll();
  }

  /* =========================
     ADD ITEM
  ========================== */
  addItem() {
    if (!this.newItem.name || this.newItem.basePrice <= 0) {
      alert('Please enter valid name and price');
      return;
    }

    this.menuService.add(this.newItem);
    this.loadItems();

    // Reset form
    this.newItem = {
      name: '',
      subtitle: 'Healthy • Fresh • Protein-rich',
      basePrice: 0,
      type: 'veg',
      image: '',
      defaultAddons: [],
      extraAddons: [],
    };
  }

  /* =========================
     DELETE
  ========================== */
  deleteItem(id: number) {
    if (confirm('Delete this item?')) {
      this.menuService.delete(id);
      this.loadItems();
    }
  }

  /* =========================
     LOGOUT
  ========================== */
  logout() {
    this.auth.logout();
  }
}