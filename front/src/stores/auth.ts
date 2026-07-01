import Cookies from "universal-cookie";
import { create } from "zustand";

import { setEcoGardenClient } from "../lib/ecoGarden";
import type { User } from "../types/user";

interface AuthStore {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  initializeAuth: VoidFunction;
  logout: VoidFunction;
}

const cookies = new Cookies();

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  initializeAuth: () => {
    const raw = cookies.get("ecogarden-user");
    const token = cookies.get("ecogarden-token");

    if (token) setEcoGardenClient(token);

    if (!raw) {
      set({ user: null, loading: false });
      return;
    }

    set({ user: raw, loading: false });
  },
  logout: () => {
    cookies.remove("ecogarden-user");
    set({ user: null });
  },
}));
