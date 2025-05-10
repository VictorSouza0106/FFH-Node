import { model, Schema } from "mongoose";

export const Lobby = model(
  "lobby",
  new Schema(
    {
      roomCode: { type: String, required: true },
      users: { type: Array, default: [] },
      gameStatus: { type: String, default: "inLobby" },
    },
    {
      timestamps: true,
    }
  )
);
