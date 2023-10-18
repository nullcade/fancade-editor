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
  const [parents, setParents] = useState<Chunk.Data[]>([]);

  useEffect(() => {
    let currentId = game.idOffset;
    const parents = new Map<number, Chunk.Data>();

    for (const chunk of game.chunks) {
      if (chunk.name) {
        chunk.type ??= Chunk.Type.Rigid;
        chunk.children ??= [];
      }
      if (!chunk.id) {
        chunk.id = currentId++;
      } else {
        currentId = chunk.id;
        if (chunk.name) parents.set(chunk.id, chunk);
        else parents.get(chunk.id)?.children.push(chunk);
      }
    }

    setParents(Array.from(parents.values()));
  }, [game.idOffset, game.chunks]);

  return (
    <Stack>
      {parents.map((parent, i) => (
        <ChunkListItem
          key={i}
          value={parent}
          update={() => setGame(game)}
          selected={selectedItem === i}
          select={() => setSelectedItem(selectedItem === i ? -1 : i)}
        />
      ))}
    </Stack>
  );
}

export default ChunksTab;
