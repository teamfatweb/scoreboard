import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type SignUpStore = {
  jwt: string;
  setJwt: (jwt: string) => void;
  logout: () => void;
};

export const useAuth = createWithEqualityFn<SignUpStore>()(
  persist(
    (set) => ({
      jwt: "",
      setJwt: (jwt: string) => set({ jwt }),
      logout: () => set({ jwt: "" }), // Add logout function
    }),

    { name: "scoreboard-auth-store" }
  ),
  shallow
);