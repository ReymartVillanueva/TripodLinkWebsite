import { server } from "../main";
import * as socketio from "socket.io";

export const createSocketConnection = (path: string): socketio.Server => {
  const io = socketio(server, { path: "/ws" + path });

  io.on("connection", (socket) => {
    console.log(`Accepted new connection.`);
    socket.on("disconnect", () => {
      console.log(`Disconnected.`);
    });
  });

  return io;
};
