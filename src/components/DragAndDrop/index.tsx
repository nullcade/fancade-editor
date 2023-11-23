import { Box, CircularProgress } from "@mui/material";
import FileOpenRoundedIcon from "@mui/icons-material/FileOpenRounded";
import { GameDecoder, Game } from "custom_modules/GameFormat";
import zlib from "pako";
import { Buffer } from "buffer";
import React, { useState, useEffect, useRef } from "react";

function DragAndDrop({
  setFile,
}: {
  setFile: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const [opacity, setOpacity] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<number>(0);
  const eventsLoaded = useRef(false);
  useEffect(() => {
    if (eventsLoaded.current) return;
    eventsLoaded.current = true;
    const root = document.getElementById("root");
    root?.addEventListener("click", (event) => {
      if (error) {
        setError(0);
        setOpacity(0);
      }
    });
    root?.addEventListener("dragover", (event) => {
      if (event.dataTransfer?.types.includes("Files") && !loading) {
        event.preventDefault();
        setError(0);
        setOpacity(1);
      }
    });
    root?.addEventListener("dragleave", (event) => {
      if (event.dataTransfer?.types.includes("Files") && !loading) {
        event.preventDefault();
        setError(0);
        setOpacity(0);
      }
    });
    root?.addEventListener("drop", async (event) => {
      event.preventDefault();
      if (event.dataTransfer?.types.includes("Files") && !loading) {
        if (event.dataTransfer.files.length > 1) {
          setError(1);
        } else if (event.dataTransfer.files.length === 0) {
          setError(2);
        } else {
          try {
            if (event.dataTransfer.files[0].name.toLowerCase().endsWith(".fc.json")) {
              setFile(
                JSON.parse(
                  new TextDecoder().decode(
                    await event.dataTransfer.files[0].arrayBuffer()
                  )
                )
              );
            } else {
              setFile(
                new GameDecoder(
                  Buffer.from(
                    zlib.inflate(
                      await event.dataTransfer.files[0].arrayBuffer()
                    )
                  )
                ).decGame()
              );
            }
            setError(-1);
          } catch (err) {
            console.error(err);
            setError(3);
          }
        }
        setTimeout(() => {
          setOpacity(0);
          setError(0);
          setLoading(false);
        }, 2000);
      }
    });
  });
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        transition:
          "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1), " +
          "backdrop-filter 225ms cubic-bezier(0.4, 0, 0.2, 1), " +
          "background-color 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor:
          error === -1
            ? "rgba(0, 64, 0, 0.5)"
            : error
            ? "rgba(64, 0, 0, 0.5)"
            : "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: opacity ? "blur(5px)" : "blur(0)",
        zIndex: "9999999999",
      }}
    >
      <FileOpenRoundedIcon
        sx={{
          fontSize: "6rem",
        }}
      />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <CircularProgress size="2rem" />
          <h3>Loading...</h3>
        </Box>
      ) : (
        <h3>
          {
            [
              "Success!",
              "Drop your fancade file here!",
              "Please drop only one file.",
              "Please drop a file.",
              "Could not read the file.",
            ][error + 1]
          }
        </h3>
      )}
    </Box>
  );
}

export default DragAndDrop;
