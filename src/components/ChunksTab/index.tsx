import React, { useEffect, useState } from "react";
import { Game, Chunk } from "../../custom_modules/GameFormat";
import { List } from "@mui/material";
import ChunkListItem from "./ChunkListItem";
import theme from "../../theme";

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
      {Object.keys(parents).map((i) => (
        <ChunkListItem
          key={i}
          value={parents[i]}
          update={() => setGame(game)}
          selected={selectedItem === i}
          select={() => setSelectedItem(selectedItem === i ? -1 : i)}
        />
      ))}
    </List>
  );
}

export default ChunksTab;
