/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '@env/environment';
import { OrderItem } from '../models/order-item';
import { StripeService } from 'ngx-stripe';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiURLOrders = environment.apiURL + 'orders';

  constructor(private http: HttpClient,
    private stripeService: StripeService
    ) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order);
  }
  createCheckoutSession(OrderItem: OrderItem[]) {
    return this.http.post(`${this.apiURLOrders}/create-checkout-session`,OrderItem).pipe(
      switchMap((session:any)=>{
        return this.stripeService.redirectToCheckout({ sessionId: session.id });
      })
      );


  }
  updateOrder(orderStaus: { status: number }, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStaus);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
  }


  cacheOrderData(order:Order){
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  getCachedOrderData(): Order {
    return JSON.parse(localStorage.getItem('orderData') ?? '');
  }

  removeCachedOrderData(){
    localStorage.removeItem('orderData');
  }
}