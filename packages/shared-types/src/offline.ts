import { Route, RouteStop, Worker } from './models';
import { PendingActionDto } from './dto';

export interface OfflineState {
  worker: Worker | null;
  route: Route | null;
  stops: RouteStop[];
  pendingActions: PendingActionDto[];
  lastSyncAt: string | null;
  isOnline: boolean;
}
