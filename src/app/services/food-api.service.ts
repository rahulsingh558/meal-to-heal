import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiFood {
  _id: string;
  name: string;
  subtitle: string;
  basePrice: number;
  calories: number;
  type: 'veg' | 'egg' | 'nonveg';
  category: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class FoodApiService {
  private API_URL = 'http://localhost:5001/api/foods';

  constructor(private http: HttpClient) {}

  getAllFoods(): Observable<ApiFood[]> {
    return this.http.get<ApiFood[]>(this.API_URL);
  }
}