import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { getEnvConfig } from '../config/env.config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  token?: string;
}

/**
 * Base API client — wraps Playwright APIRequestContext
 */
export class BaseApi {
  protected readonly baseUrl: string;

  constructor(protected readonly request: APIRequestContext) {
    this.baseUrl = getEnvConfig().apiBaseUrl;
  }

  protected buildUrl(endpoint: string, params?: ApiRequestOptions['params']): string {
    const url = new URL(endpoint.replace(/^\//, ''), this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    }
    return url.toString();
  }

  protected buildHeaders(options?: ApiRequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    };
    if (options?.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }
    return headers;
  }

  async get(endpoint: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.get(this.buildUrl(endpoint, options?.params), {
      headers: this.buildHeaders(options),
    });
  }

  async post(endpoint: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.post(this.buildUrl(endpoint, options?.params), {
      headers: this.buildHeaders(options),
      data: options?.data,
    });
  }

  async put(endpoint: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.put(this.buildUrl(endpoint, options?.params), {
      headers: this.buildHeaders(options),
      data: options?.data,
    });
  }

  async patch(endpoint: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.patch(this.buildUrl(endpoint, options?.params), {
      headers: this.buildHeaders(options),
      data: options?.data,
    });
  }

  async delete(endpoint: string, options?: ApiRequestOptions): Promise<APIResponse> {
    return this.request.delete(this.buildUrl(endpoint, options?.params), {
      headers: this.buildHeaders(options),
    });
  }

  async expectStatus(response: APIResponse, status: number): Promise<void> {
    expect(response.status(), `Unexpected status. Body: ${await response.text()}`).toBe(status);
  }

  async getJson<T = unknown>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }
}
