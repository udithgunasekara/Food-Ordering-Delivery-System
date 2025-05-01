import { WebSocketServer } from 'ws';

// Store connected drivers (driverId -> WebSocket)
const drivers = new Map();

export const initWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    // Expect driverId to be passed in query or headers
    const driverId = req.url.split('driverId=')[1];
    if (!driverId) {
      ws.close(1008, 'Driver ID required');
      return;
    }

    drivers.set(driverId, ws);
    console.log(`Driver ${driverId} connected`);

    ws.on('close', () => {
      drivers.delete(driverId);
      console.log(`Driver ${driverId} disconnected`);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for driver ${driverId}:`, error);
      drivers.delete(driverId);
    });
  });
};

export const sendWebSocketNotification = (driverId, message) => {
  const ws = drivers.get(driverId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
    console.log(`WebSocket notification sent to driver ${driverId}`);
  } else {
    console.log(`Driver ${driverId} not connected or WebSocket closed`);
  }
};