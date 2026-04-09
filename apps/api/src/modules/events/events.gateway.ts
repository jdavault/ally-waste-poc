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
    // Route-level events: entityId is the routeId
    // Stop-level events: routeId is embedded in the payload
    const routeId =
      event.entityType === EntityType.ROUTE
        ? event.entityId
        : (event.payload.routeId as string | undefined);

    if (routeId) {
      this.server.to(`route:${routeId}`).emit('route-event', event);
    }

    // Global activity feed — admin dashboard live strip
    this.server.emit('activity', event);
  }
}
