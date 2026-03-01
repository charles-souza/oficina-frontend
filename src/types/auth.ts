export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  usuario?: User;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  role?: string;
}
