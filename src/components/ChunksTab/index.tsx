import React, { useEffect, useState, useRef } from "react";
import { Stack } from "@mui/material";
import { Game, Chunk } from "custom_modules/GameFormat";
import ChunkListItem from "./ChunkListItem";

function ChunksTab({
  game,
  setGame,
  scroll,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
  scroll: (top: boolean, bottom: boolean) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const stackRef = useRef<HTMLDivElement>(null);

  function doScroll() {
    stackRef.current && scroll(
      stackRef.current.scrollTop < 15,
      stackRef.current.scrollTop + 15 > (stackRef.current.scrollHeight - stackRef.current.offsetHeight)
    )
  }

  useEffect(doScroll);

  return (
    <Stack
      justifyContent="flex-start"
      flexWrap="nowrap"
      sx={{
        overflowY: "scroll",
        height: "fit-content",
        maxHeight: '100%',
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        ":-webkit-scrollbar": {
          display: "none"
        }
      }}
      ref={stackRef}
      onScroll={event => doScroll()}
      onResize={event => doScroll()}
    >
      {game.chunks.map((chunk, index) => (
        <ChunkListItem
          key={index}
          value={chunk}
          index={index}
          update={() => setGame(game)}
          selected={selectedItem === index}
          select={() => setSelectedItem(selectedItem === index ? -1 : index)}
        />
      ))}
    </Stack>
  );
}

export default ChunksTab;
