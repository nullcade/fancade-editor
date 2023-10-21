import React, { useRef } from "react";
import zlib from "pako";
import { Buffer } from "buffer";
import { Button, ButtonGroup } from "@mui/material";
import { Publish, DataObject } from "@mui/icons-material";
import { GameDecoder, Game, Chunk } from "custom_modules/GameFormat";

function FileImport({
  setFile,
}: {
  setFile: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const binInput = useRef<HTMLInputElement>(null);
  const jsonInput = useRef<HTMLInputElement>(null);

  return (
    <ButtonGroup>
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
          onChange={async () =>
            binInput.current?.files && setFile(
              new GameDecoder(
                Buffer.from(
                  zlib.inflate(await binInput.current?.files[0].arrayBuffer()),
                ),
              ).decGame(),
            )
          }
          style={{ display: "none" }}
          accept={".fc,.bin"}
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
              const game: Game.Data = JSON.parse(await jsonInput.current?.files[0].text());
              game._rawChunks = game.chunks;
              const chunks: Chunk.Data[] = [];
              game._rawChunks.forEach(chunk => {
                if (chunk.parent && !chunk.name) {
                  if (chunk.parent >= game.idOffset && game._rawChunks.length >= chunk.parent - game.idOffset) {
                    game._rawChunks[chunk.parent - game.idOffset].children = [...game._rawChunks[chunk.parent - game.idOffset].children ?? [], chunk];
                  } else {
                    throw Error("invalid parent id for a chunk");
                  }
                } else {
                  chunks.push(chunk);
                }
              });
              game.chunks = chunks;
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
