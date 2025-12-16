import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  // ✅ Backend base URL (change once for prod)
  private readonly API_URL = 'http://localhost:6000/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: any): Observable<{ orderId: string; status: string }> {
    console.log('📦 Sending order to backend:', order);

    return this.http.post<{ orderId: string; status: string }>(
      this.API_URL,
      order
    );
  }
}
