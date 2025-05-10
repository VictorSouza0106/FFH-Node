import { lobbyRouter } from "./lobby/views/lobby.js";

export function getRoutes(app) {
  app.use("/lobby", lobbyRouter);
}
