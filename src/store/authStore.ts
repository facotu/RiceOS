import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: {
    id: string;
    full_name: string;
    role: string;
    organization_id: string;
  } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

// Store quản lý đăng nhập và phiên làm việc
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("riceos_token"),
  user: localStorage.getItem("riceos_user") 
    ? JSON.parse(localStorage.getItem("riceos_user")!) 
    : null,
  setAuth: (token, user) => {
    localStorage.setItem("riceos_token", token);
    localStorage.setItem("riceos_user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("riceos_token");
    localStorage.removeItem("riceos_user");
    set({ token: null, user: null });
  }
}));
export default useAuthStore;
