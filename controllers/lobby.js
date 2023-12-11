import { io } from "../server.js";
import socketInstance from "../server.js";
import { Lobby } from "../model/lobby.js";
import { SocketClass } from "../helpers/socket.js";

async function generateRandomCode() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomCode = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }
  return randomCode;
}

async function createRandomRoomCode() {
  var newCode = await generateRandomCode();

  const hasCode = await Lobby.findOne({ roomCode: newCode });
  if (hasCode) {
    return createRandomRoomCode();
  } else {
    return newCode;
  }
}

export async function createLobby(req, res) {
  try {
    const data = {
      _socket: socketInstance.getSocketId(),
      roomCode: await createRandomRoomCode(),
      chatEnable: false,
      mapMoveEnable: false,
      users: [
        {
          isMaster: true,
          username: "Mestre",
        },
      ],
    };
    const lobby = new Lobby(data);
    await lobby.save();
    res.status(200).send(lobby);
  } catch (err) {
    res.status(500).send("Erro interno do servidor:");
  }
}

export async function deleteLobby() {
  try {
    console.log("socketID", socketInstance.getSocketId());

    await Lobby.deleteMany({ _socket: socketInstance.getSocketId() });
  } catch (error) {
    console.log("ERR -> ", error);
  }
}

export async function getLobbyByCode(req, res) {
  try {
    const roomCode = req.params.roomCode;
    const lobby = await Lobby.findOne({ roomCode: roomCode });
    res.status(200).send(lobby);
  } catch (err) {
    res.status(500).send("Erro interno do servidor:");
  }
}

export async function addUserToLobby(req, res) {
  try {
    const data = {
      isMaster: false,
      username: req.params.username,
    };
    const roomCode = req.body.roomCode;

    const lobby = await Lobby.findOne({ roomCode: roomCode });

    if (lobby) {
      var hasUser = !!lobby.users.find(
        (user) => user.username === data.username
      );

      if (!hasUser) {
        lobby.users.push(data);
        await Lobby.updateOne({ roomCode: roomCode }, lobby);
        io.emit(roomCode, lobby);
        res.status(200).send(lobby);
      } else {
        res.status(202).send("Esse usuário ja existe");
      }
    } else res.status(202).send("Lobby Não Encontrado!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro interno do servidor:");
  }
}

export async function removeUserFromLobby(req, res) {
  const username = req.params.username;
  const roomCode = req.body.roomCode;

  const lobby = await Lobby.findOne({ roomCode: roomCode });
  if (lobby) {
    var deletedIndex = lobby.users.findIndex(
      (user) => user.username === username
    );
    if (deletedIndex !== -1) {
      lobby.users.splice(deletedIndex, 1);
      await Lobby.updateOne({ roomCode: roomCode }, lobby);
      res.status(200).send(lobby);
    } else res.status(202).send("Usuario Nao Encontrado!");
  } else res.status(202).send("Lobby Nao Encontrado!");
}
