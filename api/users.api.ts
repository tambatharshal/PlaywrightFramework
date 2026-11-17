import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from './base.api';

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * ReqRes Users API — practice API: https://reqres.in
 */
export class UsersApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listUsers(page = 1): Promise<APIResponse> {
    return this.get('/users', { params: { page } });
  }

  async getUser(id: number): Promise<APIResponse> {
    return this.get(`/users/${id}`);
  }

  async createUser(payload: CreateUserPayload): Promise<APIResponse> {
    return this.post('/users', { data: payload });
  }

  async updateUser(id: number, payload: Partial<CreateUserPayload>): Promise<APIResponse> {
    return this.put(`/users/${id}`, { data: payload });
  }

  async deleteUser(id: number): Promise<APIResponse> {
    return this.delete(`/users/${id}`);
  }

  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.post('/login', { data: payload });
  }
}
