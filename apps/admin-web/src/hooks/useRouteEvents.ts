import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { EventLog } from '@ally-waste/shared-types';

// Derive the socket origin from the same env var used by apiFetch,
// stripping the /api suffix since socket.io mounts at the root.
const SOCKET_ORIGIN = (() => {
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/api$/, '');
  if (apiUrl) return apiUrl;
  return import.meta.env.DEV
    ? 'http://localhost:8080'
    : 'https://ally-admin.p3solutionsgroup.com';
})();

export function useRouteEvents(routeId: string | undefined): EventLog[] {
  const [liveEvents, setLiveEvents] = useState<EventLog[]>([]);

  useEffect(() => {
    if (!routeId) return;

    const socket: Socket = io(SOCKET_ORIGIN, {
      path: '/api/socket.io',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      socket.emit('join-route', routeId);
    });

    socket.on('route-event', (event: EventLog) => {
      setLiveEvents(prev => [event, ...prev]);
    });

    return () => {
      socket.emit('leave-route', routeId);
      socket.disconnect();
      setLiveEvents([]);
    };
  }, [routeId]);

  return liveEvents;
}
