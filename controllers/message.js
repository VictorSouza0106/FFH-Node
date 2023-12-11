import { io } from "../server.js";
import { Message } from "../model/message.js";

export async function getMessages(req, res) {
  try {
    const messages = await Message.find({});
    res.send(messages);
    console.log("Message");
  } catch (err) {
    res.status(500).send("Erro interno do servidor");
  }
}

export async function saveMessage(req, res) {
  try {
    const message = new Message(req.body);
    await message.save();
    io.emit("message", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    res.sendStatus(500);
  }
}
