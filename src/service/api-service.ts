import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { ToastServiceMethods } from "primevue/toastservice";
import type { Ref } from "vue";
import type { ApiResponse } from "../models/api-response";
import { type Router } from "vue-router";

export class ApiService {
  private axiosInstance: AxiosInstance;
  private tokenKey: string = "access_token";
  private toast: Ref<ToastServiceMethods | null>;
  private router: Ref<Router | null>;

  constructor(
    baseURL: string,
    toast: Ref<ToastServiceMethods | null>,
    router: Ref<Router | null>
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.toast = toast;
    this.router = router;

    this.axiosInstance.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleError.bind(this)
    );

    this.axiosInstance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleError.bind(this)
    );
  }

  // Set the token in localStorage
  public setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Clear the token from localStorage (e.g., on logout)
  public clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Get the token from localStorage
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Handle requests and include the token if available
  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const token = this.getToken();
    if (token) {
      config.headers.authorization = `${token}`;
    }
    return config;
  }

  // Handle responses (optional logging or error handling)
  private handleResponse(response: AxiosResponse): AxiosResponse {
    console.log(response);
    if (response.data?.isError && this.toast.value) {
      const message =
        response?.data?.error?.errorMessage ||
        response?.data?.error?.errorKey ||
        "undefined error";

      this.toast.value.add({
        severity: "error",
        summary: "Error",
        detail: `Session Id: ${response.data?.sessionId || "xxx"}
        ${message}
        `,
      });

      throw response;
    }

    return response;
  }

  // Handle errors
  private handleError(error: any) {
    // Handle specific error scenarios here (e.g., unauthorized access)
    if (this.toast.value && this.router.value) {
      if (error.response && error.response.status === 401) {
        // Clear the token and redirect to sign-in page on 401
        this.clearToken();
        this.toast.value.add({
          severity: "warn",
          summary: "Unauthorized",
          detail: "Please sign in again.",
          life: 3000,
        });
        this.router.value.push("/signin");
      }

      const data = error?.response?.data as ApiResponse<any>;
      const message =
        data?.error?.errorMessage || data?.error?.errorKey || "undefined error";

      this.toast.value.add({
        severity: "error",
        summary: "Error",
        detail: `Session Id: ${data?.sessionId || "xxx"}
        ${message}
        `,
      });
    }
    // console.log(error);
    return Promise.reject(error);
  }

  // Generic GET request
  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, { params });
    return response.data;
  }

  // Generic POST request
  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data);
    return response.data;
  }

  // Generic PUT request
  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data);
    return response.data;
  }

  // Generic DELETE request
  public async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url);
    return response.data;
  }
}
