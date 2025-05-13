import express, { urlencoded } from "express";

import cors from "cors";
import { createServer } from "http";
import { getRoutes } from "./routes.js";
import { connectDB } from "./helpers/database.js";
import { SocketClass } from "./helpers/socket.js";

const URL = {
  ENV: "http://localhost:4200",
  PROD: "",
};

var app = express();

const corsOptions = {
  origin: ["https://space-war-front.vercel.app"], // Domínio permitido
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
  credentials: true, // Permite incluir cookies nas solicitações (se necessário)
  optionsSuccessStatus: 204, // Responde com um status 204 se a pré-verificação for bem-sucedida
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

const server = createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on port", server.address().port);
});

const socketInstance = new SocketClass(server, corsOptions);
socketInstance.startSocket();

connectDB();
getRoutes(app);

export const SOCKET_INSTANCE = socketInstance;
export default socketInstance;
