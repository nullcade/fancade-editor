import { createContext } from "react";
import { Game, GameDataDefault } from "../custom_modules/GameFormat";

export const GameContext = createContext<Game.Data>(GameDataDefault);
export const GameProvider = GameContext.Provider;