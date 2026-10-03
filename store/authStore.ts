import { create } from 'zustand';
import { getItem, setItem, clearStorage } from '../utils/asyncStorage';

interface AuthState {
    loaded: boolean;
    isOnboarded: boolean;
    load: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()((set) => ({
    loaded: false,
    isOnboarded: false,
    load: async () => {
        const onboarded = await getItem('isOnboarded');
        set({ isOnboarded: onboarded === '1', loaded: true });
    },
    completeOnboarding: async () => {
        await setItem('isOnboarded', '1');
        set({ isOnboarded: true });
    },
    logout: async () => {
        await clearStorage();
        set({ isOnboarded: false });
    }
}));

export default useAuthStore;
