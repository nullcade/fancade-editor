import { Game } from "custom_modules/GameFormat";
import { openDB } from "idb";

export const gamesDB = openDB("games", undefined, {
  upgrade(db) {
    db.createObjectStore("games");
  },
});

export async function listGames() {
  return await (await gamesDB).getAllKeys("games") as string[];
}

export async function loadGame(key: string) {
  return await (await gamesDB).get("games", key);
}

export async function storeGame(game: Game.Data) {
  await (await gamesDB).put("games", game, game.title);
}

export async function deleteGame(key: string) {
  await (await gamesDB).delete("games", key);
}
