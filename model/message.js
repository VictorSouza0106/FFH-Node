import { model } from "mongoose";

export const Message = model("message", {
  roomCode: String,
  name: String,
  message: String,
});
