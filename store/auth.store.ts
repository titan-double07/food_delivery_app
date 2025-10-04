import { appWriteServices } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setUser: (user: User) => void;
    setIsLoading: (isLoading: boolean) => void;
    fetchAuthenticatedUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setUser: (user) => set({ user }),
    setIsLoading: (isLoading) => set({ isLoading }),
    fetchAuthenticatedUser: async () => {
        set({ isLoading: true });
        try {
            const user = await appWriteServices.getCurrentUser();
            
            if (user) {
                set({ user :user as unknown as User, isAuthenticated: true, isLoading: false });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false })
            }
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));

