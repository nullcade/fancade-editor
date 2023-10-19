import React, { useState } from "react";
import { Stack } from "@mui/material";
import { Game } from "custom_modules/GameFormat";
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
      {Array.from(game.chunks).map(([id, chunk]) => (
        <ChunkListItem
          key={id}
          value={chunk}
          id={id}
          update={() => setGame(game)}
          selected={selectedItem === id}
          select={() => setSelectedItem(selectedItem === id ? -1 : id)}
        />
      ))}
    </Stack>
  );
}

export default ChunksTab;
