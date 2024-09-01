export interface LoginResponse {
  message: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
