const API_BASE_URL = "http://localhost:8000";

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  user: User;
}

export const api = {
  register: (data: { email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }),

  getUser: async (): Promise<AuthResponse | null> => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },
};
