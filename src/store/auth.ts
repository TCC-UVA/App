import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { asyncStorage } from "../services/storage/async-storage";

const AUTH_INITIAL_VALUES = {
  token: null,
  email: null,
  username: null,
};

type StateProps = {
  token: string | null;
  email: string | null;
  username: string | null;
  setToken: (token: string) => void;
  setData: (email: string, username: string) => void;
  reset: () => void;
};

export const useAuthStore = create<StateProps>()(
  persist(
    (set) => ({
      username: AUTH_INITIAL_VALUES.username,
      email: AUTH_INITIAL_VALUES.email,
      token: AUTH_INITIAL_VALUES.token,
      setToken: (token: string) => set(() => ({ token })),
      setData: (email: string, username: string) =>
        set(() => ({ email, username })),
      reset: () => set(() => AUTH_INITIAL_VALUES),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => asyncStorage),
    }
  )
);
