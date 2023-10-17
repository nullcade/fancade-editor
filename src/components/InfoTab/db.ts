import {
  Game,
  GameEncoder,
  GameDecoder,
} from "../../custom_modules/GameFormat";
import { deflate, inflate } from "pako";
import { Buffer } from "buffer";

export function loadDB(name) {
  return new Promise((res, rej) => {
    const request = indexedDB.open(name, 4);
    request.onupgradeneeded = (event) => {
      event.target.result.createObjectStore(name);
    };
    request.onsuccess = (event) => {
      res(event.target.result);
    };
    request.onerror = (event) => {
      rej(event);
    };
  });
}

export function storeGet(store, item) {
  return new Promise((res, rej) => {
    const request = store.get(item);
    request.onsuccess = (event) => res(request.result);
  });
}

export async function listGames() {
  const db = await loadDB("games");
  const store = db.transaction(["games"], "readwrite").objectStore("games");
  const request = store.getAllKeys();
  return await new Promise((res, rej) => {
    request.onsuccess = (event) => res(request.result);
  });
}

export async function loadGame(title: string) {
  const db = await loadDB("games");
  const store = db.transaction(["games"], "readwrite").objectStore("games");

  const data = await storeGet(store, title);
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
