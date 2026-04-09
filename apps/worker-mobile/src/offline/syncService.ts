import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../api/client';

export class SyncService {
  private static isSyncing = false;

  static async syncOutbox() {
    if (this.isSyncing) return;
    
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    const { outbox } = useOfflineStore.getState();
    const { workerId } = useAuthStore.getState();
    
    if (outbox.length === 0 || !workerId) return;

    this.isSyncing = true;
    console.log(`[SyncService] Starting sync for ${outbox.length} actions...`);

    try {
      // Send flattened actions + workerId
      const result = await apiFetch<any>('/sync/mobile-actions', {
        method: 'POST',
        body: JSON.stringify({
          workerId,
          actions: outbox.map(({ id: _id, ...action }) => action)
        })
      });

      console.log(`[SyncService] Sync successful: ${result.processed} actions processed.`);
      
      // Clear processed actions from store
      // Since we sent the whole outbox, we can just clear it if the server handled it
      useOfflineStore.getState().clearOutbox();
    } catch (error) {
      console.error('[SyncService] Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  static init() {
    // Watch for connection changes
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.syncOutbox();
      }
    });

    // Also periodic sync attempt
    setInterval(() => this.syncOutbox(), 30000);
  }
}
