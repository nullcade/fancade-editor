import React, { useRef } from "react";
import zlib from "pako";
import { Buffer } from "buffer";
import { Button, ButtonGroup } from "@mui/material";
import { Publish, DataObject } from "@mui/icons-material";
import { GameDecoder, Game, Chunk } from "custom_modules/GameFormat";
import TwoWayMap from "custom_modules/TwoWayMap";
import { nanoid } from "nanoid";

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
              const chunksMap = new Map<number, Chunk.Data>();
              const uuidMap = new TwoWayMap<String, number>();
              game.chunks.forEach((chunk, index) => {
                chunk.uuid = nanoid();
                if (chunk.parent) chunk.children = [];
                if (chunk.name) chunksMap.set(index + game.idOffset, chunk);
                uuidMap.set(chunk.uuid, index + game.idOffset);
              });
              game.chunks.forEach(chunk => {
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
