import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
const useAuthStore = create(
  devtools(
  persist((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (data) =>
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      },
      false,
      "auth/login"
    ),

    logout: () =>
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
  })),
  { name: "AuthStore" }
));

export default useAuthStore;
