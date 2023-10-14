import React, { useEffect, useRef, useState } from "react";
import {
  Game,
  Chunk,
  Value,
  Wire,
  Color,
  Vec,
} from "../../custom_modules/GameFormat";
import { List } from "@mui/material";
import ChunkListItem from "./ChunkListItem";
import { theme } from "../../App.tsx";

export interface ChunksOptimised {
  type: 0 | 1 | 2 | 3;
  name: string;
  locked: boolean;
  blocks: Chunk.Blocks;
  values: Value.Data[];
  wires: Wire.Data[];
  id?: number;

  color?: Color.Id;

  faces?: Chunk.Faces;
  collider?: Chunk.Collider;

  subChunks?: {
    offset: Vec;
    blocks: Chunk.Blocks;
    values: Value.Data[];
    wires: Wire.Data[];

    faces?: Chunk.Faces;
  }[];
}

function ChunksTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  let [cachedChunks, setCachedChunks] = useState<Chunk.Data[]>([]);

  const unstable = useRef<HTMLInputElement>(null);
  const [chunks, setChunks] = useState<ChunksOptimised[]>([]);

  const [selectedItem, setSelectedItem] = useState<number>(-1);

  useEffect(() => {
    if (cachedChunks === game.chunks) return;
    setSelectedItem(-1);
    setChunks([]);
    setCachedChunks(game.chunks);
  }, [game]);

  useEffect(() => {
    let chunksOptimised: ChunksOptimised[] = [];
    let remainingChunks = game.chunks.filter((value) => {
      if (value.name)
        chunksOptimised.push({
          type: value.type ?? 0,
          name: value.name,
          locked: value.locked ?? false,
          blocks: value.blocks ?? [[[]]],
          values: value.values ?? [],
          wires: value.wires ?? [],
          id: value.id ?? (chunksOptimised.at(-1)?.id ?? game.idOffset - 1) + 1,

          color: value.color,

          faces: value.faces,
          collider: value.collider,

          subChunks: value.id && value.name ? [] : undefined,
        });
      return !value.name;
    });
    chunksOptimised.map((value) => {
      if (value.id)
        remainingChunks = remainingChunks.filter((val) => {
          if (val.id === value.id) {
            if (!value.subChunks) value.subChunks = [];
            value.subChunks.push({
              offset: val.offset ?? [0, 0, 0],
              blocks: val.blocks ?? [],
              values: val.values ?? [],
              wires: val.wires ?? [],
              faces: val.faces,
            });
            return false;
          }
          return true;
        });
      return value;
    });
    console.log(chunksOptimised);
    setChunks(chunksOptimised);
  }, [cachedChunks]);

  const unoptimiseChunks = (): Chunk.Data[] => {
    let newChunks: Chunk.Data[] = [];
    chunks.forEach((value) => {
      newChunks.push({
        type: value.type,
        name: value.name,
        id: value.subChunks ? value.id : undefined,
        locked: value.locked,
        collider: value.collider,
        color: value.color,
        faces: value.faces,
        blocks: value.blocks,
        values: value.values,
        wires: value.wires,
      });
      if (value.subChunks)
        value.subChunks.forEach((val) => {
          newChunks.push({
            type: value.type,
            id: value.id,
            locked: value.locked,
            collider: value.collider,
            color: value.color,
            faces: val.faces,
            blocks: val.blocks,
            values: val.values,
            wires: val.wires,
            offset: val.offset,
          });
        });
    });
    return newChunks;
  };

  return (
    <div
      style={{
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "center",
        gap: "1rem",
        flexWrap: "wrap",
        borderRadius: "12px",
      }}
    >
      <List
        sx={{
          width: "100%",
          // height: '2rem',
          borderRadius: "inherit",
          gap: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chunks.map((value, index) => (
          <ChunkListItem
            key={index}
            value={value}
            selected={selectedItem === index}
            select={() => setSelectedItem(selectedItem === index ? -1 : index)}
          />
        ))}
      </List>
    </div>
  );
}

export default ChunksTab;
