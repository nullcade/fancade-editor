import React, { memo } from "react";
import { ChunksOptimised } from ".";
import {
  Checkbox,
  IconButton,
  ListItem,
  TextField,
  Stack,
  Collapse,
  List,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LockOpen from "@mui/icons-material/LockOpen";
import Lock from "@mui/icons-material/Lock";
import { theme } from "../../App.tsx";

function ChunkListItem({
  value,
  selected,
  select,
}: {
  value: ChunksOptimised;
  selected: boolean;
  select: () => void;
}) {
  return (
    <Stack
      sx={{
        borderRadius: theme.spacing(2),
        bgcolor: "#28292a",
      }}
    >
      <ListItem
        sx={{
          flexDirection: "row",
          wrap: "wrap",
          gap: theme.spacing(2),
          padding: theme.spacing(2),
        }}
        secondaryAction={
          value.subChunks && (
            <IconButton edge="end" aria-label="comments" onClick={select}>
              {selected ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )
        }
      >
        <TextField label="Name" defaultValue={value.name} />
        <TextField label="ID" defaultValue={value.id} />
        <Checkbox
          defaultChecked={value.locked}
          icon={<LockOpen />}
          checkedIcon={<Lock />}
        />
      </ListItem>

      {value.subChunks && (
        <Collapse in={selected}>
          <List>
            {value.subChunks.map((chunk) => (
              <ListItem
                sx={{
                  flexDirection: "row",
                  wrap: "wrap",
                  gap: theme.spacing(2),
                }}
              >
                <Stack direction="row" gap={theme.spacing(2)}>
                  <TextField label="X" defaultValue={chunk.offset[0]} />
                  <TextField label="Y" defaultValue={chunk.offset[1]} />
                  <TextField label="Z" defaultValue={chunk.offset[2]} />
                </Stack>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Stack>
  );
}

export default memo(ChunkListItem, (prevProps, newProps) => {
  return prevProps.selected === newProps.selected;
});
