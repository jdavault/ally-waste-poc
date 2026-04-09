import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { EventLog, EntityType } from '@ally-waste/shared-types';

@WebSocketGateway({
  path: '/api/socket.io',
  cors: { origin: '*' },
})
export class RouteEventsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RouteEventsGateway.name);

  afterInit() {
    this.logger.log('RouteEventsGateway initialized at /api/socket.io');
  }

  @SubscribeMessage('join-route')
  handleJoinRoute(
    @ConnectedSocket() client: Socket,
    @MessageBody() routeId: string,
  ) {
    client.join(`route:${routeId}`);
  }

  @SubscribeMessage('leave-route')
  handleLeaveRoute(
    @ConnectedSocket() client: Socket,
    @MessageBody() routeId: string,
  ) {
    client.leave(`route:${routeId}`);
  }

  broadcast(event: EventLog): void {
    // 1. Identify which per-route room should receive this event
    let targetRouteId: string | undefined;

    if (event.entityType === EntityType.ROUTE) {
      targetRouteId = event.entityId;
    } else if (event.payload.routeId) {
      targetRouteId = event.payload.routeId as string;
    }

    if (targetRouteId) {
      this.server.to(`route:${targetRouteId}`).emit('route-event', event);
    }

    // 2. Global activity feed — admin dashboard live strip
    this.server.emit('activity', event);
  }
}
