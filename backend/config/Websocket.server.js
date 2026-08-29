import { WebSocketServer } from "ws";

// Singleton WebSocket server
let wss = null;

// Runtime in-memory mapping: socketId → ws object
const clientsMap = new Map(); // global registry

export const initWebSocketServer = (httpServer) => {
  if (wss) return wss; // already initialized

  wss = new WebSocketServer({ server : httpServer })
  wss.clientsMap = clientsMap;

  console.log("✅ WebSocket server initialized");
  return wss;
};

// Worker can call this to get access to ws instances
export const getWebSocketServer = () => {
  if (!wss) {
    throw new Error("WebSocket server not initialized");
  }
  return wss;
};