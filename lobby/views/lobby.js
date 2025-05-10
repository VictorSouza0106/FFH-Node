import express from "express";

import {
  getLobbyByCode,
  createLobby,
  addUserOnLobby,
  removeUserFromLobby,
  reconnectUserOnLobby,
} from "../controllers/lobby.js";

export const lobbyRouter = express.Router();

lobbyRouter.get("/:roomCode", getLobbyByCode);

lobbyRouter.post("", createLobby);

lobbyRouter.put("/addUser/:roomCode", addUserOnLobby);
lobbyRouter.put("/removeUser/:roomCode", removeUserFromLobby);
lobbyRouter.put("/reconnectUser/:roomCode", reconnectUserOnLobby);
