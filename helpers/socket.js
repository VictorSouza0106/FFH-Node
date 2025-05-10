import { Server } from "socket.io";
// import { deleteLobby } from "../controllers/lobby.js";

export class SocketClass {
  constructor(server, corsOptions) {
    this.serverInstance = server;
    this.corsOptions = corsOptions;
    this.socketId = null;
  }

  getServer() {
    return this.serverInstance;
  }

  getIO() {
    return this.io;
  }

  getSocketId() {
    return this.socketId;
  }

  staticsetCorsOptions(corsOptions) {
    corsOptions = this.corsOptions;
  }

  setServerInstance(server) {
    server = this.server;
  }

  startSocket() {
    this.io = new Server(this.serverInstance, {
      cors: this.corsOptions,
    });

    this.io.on("connection", (socket) => {
      console.log("Connect Socket.io ", socket.id);

      this.socketId = socket.id;

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
}
