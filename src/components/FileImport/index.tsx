import React, { useRef } from "react";
import zlib from "pako";
import { unzip } from "unzipit";
import { storeGame } from "components/InfoTab/db";
import { Buffer } from "buffer";
import { Button, ButtonGroup } from "@mui/material";
import { Publish, FolderZip } from "@mui/icons-material";
import { GameDecoder, Game } from "custom_modules/GameFormat";

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
  const zipInput = useRef<HTMLInputElement>(null);

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
            binInput.current?.files &&
            setFile(decode(await binInput.current?.files[0].arrayBuffer()))
          }
          style={{ display: "none" }}
          accept={".fc,.bin"}
        />
      </Button>
      <Button size="small" onClick={() => zipInput.current?.click()}>
        <FolderZip />
        <input
          type="file"
          id="zip-input"
          ref={zipInput}
          onChange={async () => {
            const zip = await unzip(zipInput.current?.files[0]);
            const entries = Object.values(zip.entries).filter(
              (e) => !e.name.includes("."),
            );
            for await (const entry of entries) {
              const game = new GameDecoder(
                Buffer.from(zlib.inflate(await entry.arrayBuffer())),
              ).decGame();
              await storeGame(game);
              if (!storedGames.includes(game.title)) {
                storedGames.push(game.title);
                setStoredGames(storedGames);
              }
            }
          }}
          style={{ display: "none" }}
          accept={".zip"}
        />
      </Button>
    </ButtonGroup>
  );
}

export default FileImport;
