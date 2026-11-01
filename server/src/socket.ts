import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

let io: SocketIOServer | null = null;

export function initSocket(server: http.Server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // Join room based on user role or id
    socket.on('join_user', (userId: number) => {
      socket.join(`customer_${userId}`);
    });

    socket.on('join_driver', (driverId: number) => {
      socket.join(`driver_${driverId}`);
    });

    socket.on('join_booking', (bookingId: number) => {
      socket.join(`booking_${bookingId}`);
    });

    // Driver live telemetry / location ping during active trip
    socket.on('driver_location_update', (data: { bookingId: number; lat: number; lng: number; heading?: number }) => {
      if (data.bookingId) {
        socket.to(`booking_${data.bookingId}`).emit('driver_location', data);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

