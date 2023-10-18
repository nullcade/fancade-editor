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

  const [parents, setParents] = useState<Record<number, Chunk.Data[]>>({});

  useEffect(() => {
    let currentId = game.idOffset;
    const parents: Record<number, Chunk.Data> = {};

    for (const chunk of game.chunks) {
      if (chunk.name) {
        chunk.type ??= Chunk.Type.Rigid;
        chunk.children ??= [];
      }
      if (!chunk.id) {
        chunk.id = currentId++;
      } else {
        currentId = chunk.id;
        if (chunk.name) parents[chunk.id] = chunk;
        else parents[chunk.id]?.children.push(chunk);
      }
    }

    setParents(parents);
  }, [game.idOffset, game.chunks]);

  return (
    <Stack>
      {Object.keys(parents).map((i) => (
        <ChunkListItem
          key={i}
          value={parents[i]}
          update={() => setGame(game)}
          selected={selectedItem === i}
          select={() => setSelectedItem(selectedItem === i ? -1 : i)}
        />
      ))}
    </Stack>
  );
}

export default ChunksTab;
