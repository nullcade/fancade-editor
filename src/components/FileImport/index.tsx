import React, { useRef, useState } from "react";
import zlib from "pako";
import { unzip } from "unzipit";
import { storeGame } from "components/InfoTab/db";
import { Buffer } from "buffer";
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, LinearProgress } from "@mui/material";
import { Publish, DataObject } from "@mui/icons-material";
import { GameDecoder, Game, Chunk } from "custom_modules/GameFormat";

function decode(arr: ArrayBuffer) {
  return new GameDecoder(Buffer.from(zlib.inflate(arr))).decGame();
}

function FileImport({
  setFile,
  storedGames,
  setStoredGames,
}: {
  setFile: React.Dispatch<React.SetStateAction<Game.Data>>;
  storedGames: string[];
  setStoredGames: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const binInput = useRef<HTMLInputElement>(null);
  const jsonInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ButtonGroup>
      <Dialog open={loading}>
        <DialogTitle>Loading</DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Dialog>
      <Button
        variant="outlined"
        startIcon={<Publish />}
        onClick={() => binInput.current?.click()}
        sx={{ flexGrow: 1 }}
      >
        Import
        <input
          type="file"
          id="bin-input"
          ref={binInput}
          onChange={async () => {
            if (!binInput.current?.files) return;
            setLoading(true);
            if (binInput.current.files[0].name.endsWith(".zip")) {
              const zip = await unzip(binInput.current.files[0]);
              const entries = Object.values(zip.entries).filter(
                (e) => !e.name.includes(".")
              );
              for await (const entry of entries) {
                try {
                  const game = decode(await entry.arrayBuffer());
                  await storeGame(game);
                  if (!storedGames.includes(game.title)) {
                    storedGames.push(game.title);
                    setStoredGames(storedGames);
                  }
                } finally {
                }
              }
            } else {
              setFile(decode(await binInput.current?.files[0].arrayBuffer()));
            }
            setLoading(false);
          }}
          style={{ display: "none" }}
          accept={".fc,.bin,.zip"}
        />
      </Button>
      <Button size="small" onClick={() => jsonInput.current?.click()}>
        <DataObject />
        <input
          type="file"
          id="json-input"
          ref={jsonInput}
          onChange={async () => {
            if (jsonInput.current?.files) {
              const game: Game.Data = JSON.parse(
                await jsonInput.current?.files[0].text()
              );
              const chunksMap = new Map<number, Chunk.Data>();
              game.chunks.forEach((chunk, index) => {
                // chunk.uuid = nanoid();
                if (chunk.parent) chunk.children = [];
                if (chunk.name) chunksMap.set(index + game.idOffset, chunk);
              });
              game.chunks.forEach((chunk) => {
                if (chunk.name || !chunk.parent) return;
                chunksMap.get(chunk.parent)?.children?.push({
                  uuid: chunk.uuid,
                  offset: chunk.offset,
                  faces: chunk.faces,
                  blocks: chunk.blocks,
                  values: chunk.values,
                  wires: chunk.wires,
                });
              });
              game.chunks = [...chunksMap.values()];
              setFile(game);
            }
          }}
          style={{ display: "none" }}
          accept={".json"}
        />
      </Button>
    </ButtonGroup>
  );
}

export default FileImport;
