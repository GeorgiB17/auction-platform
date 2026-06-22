import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { socketAuth } from "../middleware/socketAuth.js";
import { registerRoomHandlers } from "./handlers/roomHandler.js";
import { registerBidHandlers } from "./handlers/bidHandler.js";

export let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    // join a user-specific room for direct notifications
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      console.log(`Socket ${socket.id} joined user:${socket.userId}`);
    }
    registerRoomHandlers(socket);

    registerBidHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}