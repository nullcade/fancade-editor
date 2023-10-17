import React, { useRef } from "react";
import zlib from "pako";
import { Buffer } from "buffer";
import { Button } from "@mui/material";
import { Publish } from "@mui/icons-material";
import { GameDecoder, Game } from "../../custom_modules/GameFormat";

function FileImport({
  setFile,
}: {
  setFile: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const inputFile = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    if (inputFile.current) inputFile.current.click();
  };
  const onFileChange = async () => {
    if (inputFile.current?.files)
      try {
        setFile(
          new GameDecoder(
            Buffer.from(
              zlib.inflate(await inputFile.current?.files[0].arrayBuffer()),
            ),
          ).decGame(),
        );
      } catch (e) {
        if ((e as Error).message === "incorrect header check")
          alert("Wrong file format!\nPlease choose a fancade game file.");
        else console.error(e);
      }
  };
  return (
    <Button
      variant="outlined"
      startIcon={<Publish />}
      onClick={onButtonClick}
      sx={{ flexGrow: 1 }}
    >
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      Import
    </Button>
  );
}

export default FileImport;
