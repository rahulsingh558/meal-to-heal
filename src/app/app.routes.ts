import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { CartPage } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { OrderSummary } from './pages/order-summary/order-summary';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'cart', component: CartPage },
  { path: 'checkout', component: Checkout },
  { path: 'order-summary', component: OrderSummary },
];
