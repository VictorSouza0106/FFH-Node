import { lobbyRouter } from "./lobby/views/lobby.js";

export function getRoutes(app) {
  app.use("/lobby", lobbyRouter);

  app.use("", (req, res) => res.status(200).send("WORKING"));
}
