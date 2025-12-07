import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Socket.IO uses HTTP/HTTPS protocol, not WS/WSS
    // It will upgrade to WebSocket automatically
    const protocol = window.location.protocol; // http: or https:
    const host = window.location.host;
    const socketUrl = `${protocol}//${host}`;

    console.log("Connecting to Socket.IO server:", socketUrl);

    socket = io(socketUrl, {
      path: "/socket.io/",
      transports: ["polling", "websocket"], // Try polling first, then upgrade to websocket
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket?.id);
    });

    socket.on("disconnect", (_reason) => {
      console.log("WebSocket disconnected:", _reason);
    });

    socket.on("connect_error", (_error) => {
      console.error("WebSocket connection error:", _error);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
