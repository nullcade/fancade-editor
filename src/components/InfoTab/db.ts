import {
  Game,
  GameEncoder,
  GameDecoder,
} from "../../custom_modules/GameFormat";
import { deflate, inflate } from "pako";
import { Buffer } from "buffer";
import {openDB} from "idb"

export async function listGames() {
  const db = await openDB("games");
  return await db.getAllKeys("games");
}

export async function loadGame(key: string) {
  const db = await openDB("games");
  const data = await db.get("games", key);
  const game = new GameDecoder(Buffer.from(inflate(data))).decGame();
  return game;
}

export async function storeGame(game: Game.Data) {
  const db = await openDB("games");
  const data = deflate(new GameEncoder(game).encGame());
  await db.put("games", data, game.title);
}

export async function deleteGame(key: string) {
  const db = await openDB("games");
  await db.delete("games", key)
}
