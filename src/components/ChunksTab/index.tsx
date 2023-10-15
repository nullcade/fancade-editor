import React, { useEffect, useState } from "react";
import { Game, Chunk } from "../../custom_modules/GameFormat";
import { List } from "@mui/material";
import ChunkListItem from "./ChunkListItem";
import { theme } from "../../App.tsx";

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
    const parents = game.chunks.filter((c) => c.name);
    setParents(parents);
    parents.forEach((chunk, i) => {
      if (!chunk.id) chunk.id = i ? parents[i - 1].id + 1 : game.idOffset;
      else
        chunk.children = game.chunks.filter(
          (c) => !c.name && c.id === chunk.id,
        );
    });
  }, [game.idOffset, game.chunks]);

  return (
    <List
      sx={{
        width: "100%",
        maxHeight: "calc(100vh - 180px)",
        overflow: "auto",
        borderRadius: "inherit",
        gap: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
      }}
    >
      {parents.map((value, index) => (
        <ChunkListItem
          key={index}
          value={value}
          update={() => setGame(game)}
          selected={selectedItem === index}
          select={() => setSelectedItem(selectedItem === index ? -1 : index)}
        />
      ))}
    </List>
  );
}

export default ChunksTab;
