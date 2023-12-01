import React from "react";
import zlib from "pako";
import { FileDownload, DataObject } from "@mui/icons-material";
import { Button, ButtonGroup } from "@mui/material";
import { GameEncoder, Game, Chunk } from "custom_modules/GameFormat";

function FileExport({ game }: { game: Game.Data }) {
  const flatChunks = (chunks: Chunk.Data[]) => {
    const flatChunks: Chunk.Data[] = [];
    chunks.forEach((chunk, index) =>
      flatChunks.push({
        uuid: chunk.uuid,
        type: chunk.type,
        name: chunk.name,
        parent: index + game.idOffset,
        offset: chunk.offset,
        locked: chunk.locked,
        collider: chunk.collider,
        color: chunk.color,
        faces: chunk.faces,
        blocks: chunk.blocks,
        values: chunk.values,
        wires: chunk.wires,
      }),
    );
    chunks.forEach(
      (parent, index) =>
        parent.children &&
        parent.children.forEach((chunk) =>
          flatChunks.push({
            uuid: chunk.uuid,
            type: parent.type,
            parent: index + game.idOffset,
            offset: chunk.offset,
            locked: parent.locked,
            collider: parent.collider,
            color: parent.color,
            faces: chunk.faces,
            blocks: chunk.blocks,
            values: chunk.values,
            wires: chunk.wires,
          }),
        ),
    );
    return flatChunks;
  };
  return (
    <ButtonGroup>
      <Button
        variant="outlined"
        startIcon={<FileDownload />}
        onClick={() => {
          saveFile(
            zlib.deflate(new GameEncoder(game).encGame()),
            (game.title.length !== 0 ? game.title : "New Game") + ".fc",
          );
        }}
        sx={{ flexGrow: 1 }}
      >
        Export
      </Button>
      <Button
        size="small"
        onClick={() => {
          saveFile(
            JSON.stringify(
              {
                appVersion: game.appVersion,
                title: game.title,
                author: game.author,
                description: game.description,
                idOffset: game.idOffset,
                chunks: flatChunks(game.chunks),
              },
              null,
              4,
            ),
            (game.title.length !== 0 ? game.title : "New Game") + ".fc.json",
          );
        }}
      >
        <DataObject />
      </Button>
    </ButtonGroup>
  );
}

async function saveFile(blob: any, suggestedName: string) {
  const extension = `.${suggestedName.split(".").at(-1)}`;
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    "showSaveFilePicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    try {
      // Show the file save dialog.
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "Fancade game binary",
            accept: { "application/octet-stream": [extension as `.${string}`] },
          },
        ],
      });

      const writable = await handle.createWritable();
      writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      // Fail silently if the user has simply canceled the dialog.
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err.name, err.message);
      }
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }
  // Fallback if the File System Access API is not supported…
  // Create the blob URL.
  const blobURL = URL.createObjectURL(new Blob([blob]));
  // Create the `<a download>` element and append it invisibly.
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = suggestedName;
  a.style.display = "none";
  document.body.append(a);
  // Programmatically click the element.
  a.click();
  // Revoke the blob URL and remove the element.
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);
}

export default FileExport;
