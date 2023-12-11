import { model } from "mongoose";

export const Lobby = model("lobby", {
  _socket: String,
  roomCode: String,
  chatEnable: Boolean,
  mapMoveEnable: Boolean,
  users: Array,
});
