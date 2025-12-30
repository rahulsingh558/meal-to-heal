import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuAdminService, AdminMenuItem } from '../../../services/menu-admin.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-menu.html',
})
export class AdminMenuComponent {
  items: AdminMenuItem[] = [];
  showMenuForm = false;
  newItem: Omit<AdminMenuItem, 'id'> = {
    name: '',
    subtitle: 'Healthy • Fresh • Protein-rich',
    basePrice: 0,
    type: 'veg',
    image: '',
    defaultAddons: [],
    extraAddons: [],
  };

  constructor(private menuService: MenuAdminService) {
    this.loadItems();
  }

  loadItems() {
    this.items = this.menuService.getAll();
  }

  addItem() {
    if (!this.newItem.name || this.newItem.basePrice <= 0) return;

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
    
    this.showMenuForm = false;
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuService.delete(id);
      this.loadItems();
    }
  }
}