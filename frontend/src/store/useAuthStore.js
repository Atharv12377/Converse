import { create } from "zustand";
import { devtools } from "zustand/middleware";
const useAuthStore = create(
  devtools((set) => ({
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
      "auth/signup"
    ),

    logout: () =>
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),
  })),
  { name: "AuthStore" }
);

export default useAuthStore;
