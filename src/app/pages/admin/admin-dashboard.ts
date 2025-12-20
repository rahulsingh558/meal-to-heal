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
  /* =========================
     MENU ITEMS
  ========================== */
  items: AdminMenuItem[] = [];

  newItem: Omit<AdminMenuItem, 'id'> = {
    name: '',
    subtitle: 'Healthy • Fresh • Protein-rich',
    basePrice: 0,
    type: 'veg',
    image: '',
    defaultAddons: [],
    extraAddons: [],
  };

  /* =========================
     DASHBOARD METRICS
  ========================== */
  totalOrders = 124;
  totalCustomers = 68;
  notifications = 3;

  revenueThisWeek = 11980;
  revenueLastWeek = 9800;

  get totalRevenue(): number {
    return this.revenueThisWeek;
  }

  get revenueChangePercent(): number {
    if (this.revenueLastWeek === 0) return 0;

    return Math.round(
      ((this.revenueThisWeek - this.revenueLastWeek) /
        this.revenueLastWeek) *
        100
    );
  }

  /* ✅ ALIAS USED BY TEMPLATE */
  get revenueGrowthPercent(): number {
    return this.revenueChangePercent;
  }

  /* =========================
     ORDERS BAR CHART
  ========================== */
  ordersChart: { day: string; value: number }[] = [
    { day: 'Mon', value: 12 },
    { day: 'Tue', value: 18 },
    { day: 'Wed', value: 9 },
    { day: 'Thu', value: 15 },
    { day: 'Fri', value: 21 },
  ];

  maxOrders = Math.max(...this.ordersChart.map(o => o.value));

  get ordersLast5Days(): number {
    return this.ordersChart.reduce((sum, o) => sum + o.value, 0);
  }

  /* =========================
     REVENUE LINE CHART
  ========================== */
  revenueChart: { day: string; value: number }[] = [
    { day: 'Mon', value: 8200 },
    { day: 'Tue', value: 9100 },
    { day: 'Wed', value: 7600 },
    { day: 'Thu', value: 10400 },
    { day: 'Fri', value: 11980 },
  ];

  maxRevenue = Math.max(...this.revenueChart.map(r => r.value));
  revenuePolylinePoints = '';

  /* =========================
     TABLE DATA
  ========================== */
  recentOrders = [
    { id: '#ORD-101', customer: 'Rahul', amount: 280, status: 'Paid' },
    { id: '#ORD-102', customer: 'Amit', amount: 160, status: 'Paid' },
    { id: '#ORD-103', customer: 'Neha', amount: 340, status: 'Pending' },
    { id: '#ORD-104', customer: 'Sneha', amount: 220, status: 'Paid' },
    { id: '#ORD-105', customer: 'Vikas', amount: 180, status: 'Cancelled' },
  ];

  bestSelling = [
    { name: 'Moong Sprouts Bowl', sold: 52 },
    { name: 'Egg Meal Bowl', sold: 41 },
    { name: 'Paneer Sprouts Bowl', sold: 34 },
    { name: 'Chicken Bowl', sold: 28 },
  ];

  constructor(
    private menuService: MenuAdminService,
    private auth: AdminAuthService
  ) {
    /* Seed menu once */
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
    ]);

    this.loadItems();
    this.buildRevenuePolyline();
  }

  /* =========================
     HELPERS
  ========================== */
  buildRevenuePolyline() {
    this.revenuePolylinePoints = this.revenueChart
      .map(
        (p, i) =>
          `${i * 60 + 20},${160 - (p.value / this.maxRevenue) * 120}`
      )
      .join(' ');
  }

  /* =========================
     CRUD
  ========================== */
  loadItems() {
    this.items = this.menuService.getAll();
  }

  addItem() {
    if (!this.newItem.name || this.newItem.basePrice <= 0) return;

    this.menuService.add(this.newItem);
    this.loadItems();

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

  deleteItem(id: number) {
    if (confirm('Delete this item?')) {
      this.menuService.delete(id);
      this.loadItems();
    }
  }

  logout() {
    this.auth.logout();
  }
}