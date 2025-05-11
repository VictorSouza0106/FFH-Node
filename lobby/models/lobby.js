import { model, Schema } from "mongoose";

const DEFAULT_TEAMS = [
  {
    primaryColor: "#A95CDB",
    secondaryColor: "#A95CDB80",
    teamName: "purple",
    players: {
      chicken: null,
      cat: null,
    },
  },
  {
    primaryColor: "#5665DB",
    secondaryColor: "#5665DB80",
    teamName: "blue",
    players: {
      chicken: null,
      cat: null,
    },
  },
  {
    primaryColor: "#4BDB94",
    secondaryColor: "#4BDB9480",
    teamName: "green",
    players: {
      chicken: null,
      cat: null,
    },
  },
  {
    primaryColor: "#DB944B",
    secondaryColor: "#DB944B80",
    teamName: "orange",
    players: {
      chicken: null,
      cat: null,
    },
  },
];

export const Lobby = model(
  "lobby",
  new Schema(
    {
      roomCode: { type: String, required: true },
      users: { type: Array, default: [] },
      gameStatus: { type: String, default: "inLobby" },
      gameConfigs: { type: Object },
      gameTeams: { type: Array, default: DEFAULT_TEAMS },
    },
    {
      timestamps: true,
    }
  )
);
