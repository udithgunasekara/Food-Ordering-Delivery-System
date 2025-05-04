import { WebSocketServer } from 'ws';
import { parse } from 'url';

const drivers = new Map();

const initWebSocketServer = (server) => {
  console.log('Initializing WebSocket server on path /api/notifications');
  const wss = new WebSocketServer({ path: '/api/notifications', server });

  wss.on('connection', (ws, req) => {
    console.log('Connection attempt:', req.url);
    const parsedUrl = parse(req.url, true);
    if (parsedUrl.pathname !== '/api/notifications') {
      console.log('Invalid WebSocket path:', parsedUrl.pathname);
      ws.close(1008, 'Invalid WebSocket path');
      return;
    }

    const driverId = parsedUrl.query.driverId;
    if (!driverId || typeof driverId !== 'string') {
      console.log('Missing or invalid driverId:', parsedUrl.query);
      ws.close(1008, 'Driver ID required');
      return;
    }

    drivers.set(driverId, ws);
    console.log(`Driver ${driverId} connected to /api/notifications`);

    ws.on('close', () => {
      drivers.delete(driverId);
      console.log(`Driver ${driverId} disconnected`);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for driver ${driverId}:`, error);
      drivers.delete(driverId);
    });
  });

  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });
};

const sendWebSocketNotification = (driverId, message) => {
  const ws = drivers.get(driverId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
    console.log(`WebSocket notification sent to driver ${driverId}`);
  } else {
    console.log(`Driver ${driverId} not connected or WebSocket closed`);
  }
};

export { initWebSocketServer, sendWebSocketNotification };