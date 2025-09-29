/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource
} from "axios";
import Config from "../config/index";
import ls from "localstorage-slim";

export class HttpService {
  private axiosInstance: AxiosInstance;
  private cancelTokenSources: Map<string, CancelTokenSource> = new Map();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Config.API_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = ls.get("access_token", { decrypt: true });
        // Safely set headers
        config.headers = {
          ...(config.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(Config.API_ENDPOINT.includes("ngrok")
            ? { "ngrok-skip-browser-warning": "true" }
            : {}),
        };

        if (Config.DEBUG) {
          console.log(`${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (Config.DEBUG) {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
            { status: response.status, data: response.data }
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (Config.DEBUG) {
          console.error(
            `❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
            {
              status: error.response?.status,
              message: (error.response?.data as any) || error.message,
            }
          );
        }

        // 401 handling (optional refresh)
        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = ls.get("refresh_token", { decrypt: true });
            if (refreshToken) {
              // TODO: implement refresh flow
              // const newToken = await this.refreshToken(refreshToken);
              // ls.set("access_token", newToken, { encrypt: true });
              // return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            if (Config.DEBUG) console.error("Token refresh failed:", refreshError);
          }
          this.clearAuthData();
        }

        // IMPORTANT: always propagate error
        return Promise.reject(error);
      }
    );
  }

  private clearAuthData(): void {
    ls.remove("access_token");
    ls.remove("refresh_token");
  }

  /** Deprecated: token is auto-injected by interceptor, kept for compatibility */
  static setToken(token: string): void {
    console.warn("HttpService.setToken is deprecated. Token is now handled automatically.");
    ls.set("access_token", token, { encrypt: true });
  }

  /** Create a cancel token for a request */
  private createCancelToken(key: string): CancelTokenSource {
    const existing = this.cancelTokenSources.get(key);
    if (existing) {
      existing.cancel(`Request ${key} cancelled due to new request`);
    }
    const source = axios.CancelToken.source();
    this.cancelTokenSources.set(key, source);
    return source;
  }

  /** GET */
  protected get = async <T = any>(
    url: string,
    params?: object,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const key = `GET-${url}`;
    try {
      const cancelToken = this.createCancelToken(key);
      const response = await this.axiosInstance.get<T>(url, {
        params,
        cancelToken: cancelToken.token,
        ...options,
      });
      this.cancelTokenSources.delete(key);
      return response.data; // unwrapped
    } catch (error: any) {
      this.cancelTokenSources.delete(key);
      throw error;
    }
  };

  /** POST */
  protected post = async <T = any>(
    url: string,
    body?: object,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const key = `POST-${url}`;
    try {
      const cancelToken = this.createCancelToken(key);
      const response = await this.axiosInstance.post<T>(url, body, {
        cancelToken: cancelToken.token,
        ...options,
      });
      this.cancelTokenSources.delete(key);
      return response.data; // unwrapped
    } catch (error: any) {
      this.cancelTokenSources.delete(key);
      throw error;
    }
  };

  /** Custom POST with full URL — now also returns unwrapped payload for consistency */
  protected custom_post = async <T = any>(
    url: string,
    body?: object,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const key = `CUSTOM-POST-${url}`;
    try {
      const cancelToken = this.createCancelToken(key);
      const response = await axios.post<T>(url, body, {
        cancelToken: cancelToken.token,
        ...options,
      });
      this.cancelTokenSources.delete(key);
      return response.data; // unwrapped (changed from AxiosResponse<T>)
    } catch (error: any) {
      this.cancelTokenSources.delete(key);
      throw error;
    }
  };

  /** PUT */
  protected put = async <T = any>(
    url: string,
    body?: object,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const key = `PUT-${url}`;
    try {
      const cancelToken = this.createCancelToken(key);
      const response = await this.axiosInstance.put<T>(url, body, {
        cancelToken: cancelToken.token,
        ...options,
      });
      this.cancelTokenSources.delete(key);
      return response.data; // unwrapped
    } catch (error: any) {
      this.cancelTokenSources.delete(key);
      throw error;
    }
  };

  /** PATCH */
  protected patch = async <T = any>(
    url: string,
    body?: object,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const key = `PATCH-${url}`;
    try {
      const cancelToken = this.createCancelToken(key);
      const response = await this.axiosInstance.patch<T>(url, body, {
        cancelToken: cancelToken.token,
        ...options,
      });
      this.cancelTokenSources.delete(key);
      return response.data; // unwrapped
    } catch (error: any) {
      this.cancelTokenSources.delete(key);
      throw error;
    }
  };

  /** DELETE */
  protected delete = async <T = any>(
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const key = `DELETE-${url}`;
    try {
      const cancelToken = this.createCancelToken(key);
      const response = await this.axiosInstance.delete<T>(url, {
        cancelToken: cancelToken.token,
        ...options,
      });
      this.cancelTokenSources.delete(key);
      return response.data; // unwrapped
    } catch (error: any) {
      this.cancelTokenSources.delete(key);
      throw error;
    }
  };

  /** Cancel by key or all */
  cancel = (key?: string): void => {
    if (key) {
      const source = this.cancelTokenSources.get(key);
      if (source) {
        source.cancel(`Request ${key} cancelled explicitly`);
        this.cancelTokenSources.delete(key);
      }
    } else {
      this.cancelTokenSources.forEach((source, k) => {
        source.cancel(`Request ${k} cancelled - all requests cancelled`);
      });
      this.cancelTokenSources.clear();
    }
  };

  /** Expose raw axios if needed */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const httpService = new HttpService();
