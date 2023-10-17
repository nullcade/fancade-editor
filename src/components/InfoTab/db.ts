import {
  Game,
  GameEncoder,
  GameDecoder,
} from "../../custom_modules/GameFormat";
import { deflate, inflate } from "pako";
import { Buffer } from "buffer";

export function promisifyRequest(request: IDBRequest) {
  return new Promise((res, rej) => {
    request.onsuccess = (event) => {
      res(request.result);
    };
    request.onerror = (event) => {
      rej(event.error);
    };
  });
}

export async function loadDB(name) {
  const request = indexedDB.open(name, 4);
  request.onupgradeneeded = (event) => {
    event.target.result.createObjectStore(name);
  };
  return await promisifyRequest(request);
}

export async function storeGet(store, item) {
  return await promisifyRequest(store.get(item));
}

export async function listGames() {
  const db = await loadDB("games");
  const store = db.transaction(["games"], "readwrite").objectStore("games");
  const request = store.getAllKeys();
  return await promisifyRequest(request);
}

export async function loadGame(key: string) {
  const db = await loadDB("games");
  const store = db.transaction(["games"], "readwrite").objectStore("games");

  const data = await storeGet(store, key);
  if (!data) return;
  const game = new GameDecoder(Buffer.from(inflate(data))).decGame();
  db.close();
  return game;
}

export async function storeGame(game: Game.Data) {
  const db = await loadDB("games");
  const store = db.transaction(["games"], "readwrite").objectStore("games");

  const data = deflate(new GameEncoder(game).encGame());
  store.put(data, game.title);
  db.close();
}

export async function deleteGame(key: string) {
  const db = await loadDB("games");
  const store = db.transaction(["games"], "readwrite").objectStore("games");
  await promisifyRequest(store.delete(key));
}
