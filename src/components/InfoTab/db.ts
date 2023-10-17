import { openDB } from "idb";

export async function listGames() {
  const db = await openDB("games");
  return await db.getAllKeys("games");
}

export async function loadGame(key: string) {
  const db = await openDB("games");
  return await db.get("games", key);
}

export async function storeGame(game: Game.Data) {
  const db = await openDB("games");
  await db.put("games", game, game.title);
}

export async function deleteGame(key: string) {
  const db = await openDB("games");
  await db.delete("games", key);
}
