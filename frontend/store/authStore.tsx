import { create } from "zustand";
type su = {
  username: string;
  email: string;
  password: string;
};
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async ({ username, email, password }: su) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
    } catch (error) {}
  },
}));
