import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '../store/offlineStore';
import { apiFetch } from '../api/client';

export class SyncService {
  private static isSyncing = false;

  static async syncOutbox() {
    if (this.isSyncing) return;
    
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    const { outbox, removeAction } = useOfflineStore.getState();
    if (outbox.length === 0) return;

    this.isSyncing = true;
    console.log(`[SyncService] Starting sync for ${outbox.length} actions...`);

    try {
      // We'll attempt to sync in one batch using the endpoint we built
      const result = await apiFetch<any>('/sync/mobile-actions', {
        method: 'POST',
        body: JSON.stringify({
          actions: outbox.map(a => ({
            type: a.type,
            payload: a.payload,
            timestamp: a.timestamp
          }))
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
