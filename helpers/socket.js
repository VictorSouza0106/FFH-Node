import { Server } from "socket.io";
// import { deleteLobby } from "../controllers/lobby.js";

export class SocketClass {
  constructor(server, corsOptions) {
    this.serverInstance = server;
    this.corsOptions = corsOptions;
    this.socket = null;
  }

  getServer() {
    return this.serverInstance;
  }

  getIO() {
    return this.io;
  }

  getSocket() {
    return this.socket;
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

      this.socket = socket;

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
}
