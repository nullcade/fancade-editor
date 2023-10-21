import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { Game, Chunk } from "custom_modules/GameFormat";
import ChunkListItem from "./ChunkListItem";

function ChunksTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  
  return (
    <Stack>
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
