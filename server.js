import express, { urlencoded } from "express";

import cors from "cors";
import { createServer } from "http";

import { connectDB } from "./helpers/database.js";
import { getRoutes } from "./helpers/routes.js";
import { SocketClass } from "./helpers/socket.js";

const URL = {
  ENV: "http://localhost:4200",
  PROD: "",
};

var app = express();

const corsOptions = {
  origin: "http://localhost:4200", // Domínio permitido
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
  credentials: true, // Permite incluir cookies nas solicitações (se necessário)
  optionsSuccessStatus: 204, // Responde com um status 204 se a pré-verificação for bem-sucedida
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

const server = createServer(app);

server.listen(3000, () => {
  console.log("Server is running on port", server.address().port);
});

const socketInstance = new SocketClass(server, corsOptions);
socketInstance.startSocket();

connectDB();
getRoutes(app);

export const io = socketInstance.getIO();
export default socketInstance;
