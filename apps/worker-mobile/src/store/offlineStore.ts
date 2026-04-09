import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PendingActionType = 'COMPLETE_STOP' | 'MISS_STOP' | 'REPORT_ISSUE' | 'LOCATION_PING';

export interface PendingAction {
  id: string;
  type: PendingActionType;
  payload: any;
  timestamp: string;
}

interface OfflineState {
  outbox: PendingAction[];
  addAction: (type: PendingActionType, payload: any) => void;
  removeAction: (id: string) => void;
  clearOutbox: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      outbox: [],
      addAction: (type, payload) => set((state) => ({
        outbox: [...state.outbox, {
          id: Math.random().toString(36).substring(7),
          type,
          payload,
          timestamp: new Date().toISOString()
        }]
      })),
      removeAction: (id) => set((state) => ({
        outbox: state.outbox.filter(a => a.id !== id)
      })),
      clearOutbox: () => set({ outbox: [] }),
    }),
    {
      name: 'ally-waste-offline',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
