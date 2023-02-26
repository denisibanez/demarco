import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeHttpService {
  constructor(private http: HttpClient) {}

  getCustomers(payload: any) {
    return this.http.get(`${environment.BASE_PATH}customers/?${payload}`);
  }
  getCustomerById(id: any) {
    return this.http.get(`${environment.BASE_PATH}customers/${id}`);
  }

  getOrders(customerId: any) {
    return this.http.get(`${environment.BASE_PATH}orders/${customerId}`);
  }

  deleteClient(customerId: any) {
    return this.http.delete(`${environment.BASE_PATH}customers/${customerId}`);
  }

  postCustomer(payload: any) {
    return this.http.post(`${environment.BASE_PATH}customers`, payload);
  }
}
