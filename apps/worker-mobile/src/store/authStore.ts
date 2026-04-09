import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  workerId: string | null;
  workerName: string | null;
  hydrated: boolean;
  setWorker: (id: string, name: string) => void;
  clearWorker: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      workerId: null,
      workerName: null,
      hydrated: false,
      setWorker: (id, name) => set({ workerId: id, workerName: name }),
      clearWorker: () => set({ workerId: null, workerName: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'ally-waste-auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return () => state.setHydrated();
      },
    }
  )
);
