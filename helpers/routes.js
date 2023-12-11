import { getMessages, saveMessage } from "../controllers/message.js";
import {
  createLobby,
  getLobbyByCode,
  addUserToLobby,
  removeUserFromLobby,
} from "../controllers/lobby.js";

export function getRoutes(app) {
  // Message Routes

  app.get("/messages", getMessages);

  app.post("/messages", saveMessage);

  // Lobby Routes

  app.get("/lobby/:roomCode", getLobbyByCode);

  app.post("/lobby", createLobby);

  app.put("/lobby/addUser/:username", addUserToLobby);

  app.put("/lobby/removeUser/:username", removeUserFromLobby);
}
