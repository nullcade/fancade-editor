import { Game } from "./types";

export * from "./types";
export * from "./GameDecoder";
export * from "./GameEncoder";
export const GameDataDefault: Game.Data = {
  appVersion: 31,
  title: "",
  author: "",
  description: "",
  idOffset: 597,
  chunks: [],
};
