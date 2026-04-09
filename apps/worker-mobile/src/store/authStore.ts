import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  workerId: string | null;
  workerName: string | null;
  setWorker: (id: string, name: string) => void;
  clearWorker: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      workerId: null,
      workerName: null,
      setWorker: (id, name) => set({ workerId: id, workerName: name }),
      clearWorker: () => set({ workerId: null, workerName: null }),
    }),
    {
      name: 'ally-waste-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
