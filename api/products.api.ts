import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from './base.api';

/**
 * Local dummy-app Products / Orders API
 */
export class ProductsApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listProducts(): Promise<APIResponse> {
    return this.get('/products');
  }

  async getProduct(id: number): Promise<APIResponse> {
    return this.get(`/products/${id}`);
  }

  async createOrder(payload: {
    items: Array<{ id: number; name: string; price: number }>;
    customer: { firstName: string; lastName: string; postalCode: string };
  }): Promise<APIResponse> {
    return this.post('/orders', { data: payload });
  }

  async login(username: string, password: string): Promise<APIResponse> {
    return this.post('/login', { data: { username, password } });
  }
}
