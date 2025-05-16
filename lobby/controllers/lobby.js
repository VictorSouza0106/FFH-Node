import { SOCKET_INSTANCE } from "../../server.js";
import { Lobby } from "../models/lobby.js";

// helper functions

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

// View Functions
export async function createLobby(req, res) {
  let data = req.body;
  let roomCode = await createRandomRoomCode();

  const userData = {
    username: data["username"],
    LU_ID: null,
    connect: true,
    isMaster: false,
    socked_id: SOCKET_INSTANCE.getSocket().id,
  };

  try {
    const data = {
      _socket: SOCKET_INSTANCE.getSocket().id,
      roomCode: roomCode,
      chatEnable: false,
      mapMoveEnable: false,
      users: [userData],
    };
    const lobby = new Lobby(data);
    await lobby.save();

    console.log();
    SOCKET_INSTANCE.getSocket().join(roomCode);
    SOCKET_INSTANCE.getIO()
      .of("/")
      .in(roomCode)
      .allSockets()
      .then((sockets) => {
        console.log(`Sockets na sala ${roomCode}:`, Array.from(sockets));
      });
    socketMessageListener();
    res.status(200).send(lobby);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro interno do servidor:");
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

export async function addUserOnLobby(req, res) {
  try {
    const data = req.body;

    // TODO: adicionar LU_ID generate_system
    const userData = {
      username: data["username"],
      LU_ID: null,
      connect: true,
      isMaster: false,
      socked_id: SOCKET_INSTANCE.getSocket().id,
    };
    const roomCode = req.params.roomCode;

    const lobby = await Lobby.findOne({ roomCode: roomCode });

    if (!lobby) {
      res.status(202).send("Lobby Não Encontrado!");
      return;
    }

    let hasUser = lobby.users.filter(
      (user) => user.username === data.username
    ).length;

    if (hasUser) {
      res.status(202).send("Esse usuário ja existe");
      return;
    }

    lobby.users.push(userData);
    await Lobby.updateOne({ roomCode: roomCode }, lobby);

    SOCKET_INSTANCE.getSocket().join(roomCode);
    socketMessageListener();
    emitLobbyUserUpdate(roomCode, lobby);
    res.status(200).send(lobby);
  } catch (error) {
    res.status(500).send("Erro interno do servidor:");
  }
}

export async function reconnectUserOnLobby(req, res) {
  try {
    const data = req.body;

    // TODO: adicionar LU_ID generate_system
    const userData = {
      username: data["username"],
      LU_ID: null,
      connect: true,
      isMaster: false,
      socked_id: SOCKET_INSTANCE.getSocket().id,
    };
    const roomCode = req.params.roomCode;

    const lobby = await Lobby.findOne({ roomCode: roomCode });

    if (!lobby) {
      res.status(202).send("Lobby Não Encontrado!");
      return;
    }

    let userIndex = lobby.users.findIndex((user) => {
      console.log("USERRRS", user.username, data.username, userData.socked_id);
      return user.username === data.username;
    });

    if (!userIndex === -1) {
      res.status(202).send("Esse usuário não existe");
      return;
    }

    lobby.users[userIndex] = userData;
    await Lobby.updateOne({ roomCode: roomCode }, lobby);
    console.log(lobby.users);

    emitLobbyUserUpdate(roomCode, lobby);
    res.status(200).send(lobby);
  } catch (error) {
    res.status(500).send("Erro interno do servidor:");
  }
}

export async function removeUserFromLobby(req, res) {
  const data = req.body;
  const roomCode = req.params.roomCode;

  const lobby = await Lobby.findOne({ roomCode: roomCode });

  if (!lobby) {
    res.status(202).send("Lobby Não Encontrado!");
    return;
  }

  var deletedIndex = lobby.users.findIndex(
    (user) => user.username === data.username
  );

  if (deletedIndex === -1) {
    res.status(202).send("Usuario não encontrado");
    return;
  }

  lobby.users.splice(deletedIndex, 1);
  await Lobby.updateOne({ roomCode: roomCode }, lobby);

  emitLobbyUserUpdate(roomCode, lobby);
  res.status(200).send(lobby);
}

function emitLobbyUserUpdate(roomCode, lobby) {
  lobby.gameTeams.forEach((t) => console.log(t));

  SOCKET_INSTANCE.getIO().to(roomCode).emit("updateLobby", lobby);
}

function socketMessageListener() {
  // message
  // roomCode
  // data

  SOCKET_INSTANCE.getSocket().on("client_message", (message) => {
    console.log(message);
    emitLobbyUserUpdate(message.roomCode, message.data);
  });
}
