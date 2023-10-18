import { Game } from "./types";

export * from "./types";
export * from "./GameDecoder";
export * from "./GameEncoder";
export const emptyGame: Game.Data = {
  appVersion: 31,
  title: "",
  author: "",
  description: "",
  idOffset: 597,
  chunks: [],
};
export const newGame: Game.Data = {
  ...emptyGame,
  title: "New Game",
  author: "Unknown Author",
  description: "A Fancade game",
};
