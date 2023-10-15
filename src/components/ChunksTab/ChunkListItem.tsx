import React, { memo } from "react";
import { Chunk } from "../../custom_modules/GameFormat/types";
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
  value: Chunk.Data;
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
          paddingRight: theme.spacing(6),
        }}
        secondaryAction={
          value.children?.length ? (
            <IconButton edge="end" aria-label="comments" onClick={select}>
              {selected ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          ) : undefined
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

      {value.children?.length ? (
        <Collapse in={selected}>
          <List>
            {value.children.map((chunk) => (
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
      ) : undefined}
    </Stack>
  );
}

export default memo(ChunkListItem, (prevProps, newProps) => {
  return prevProps.selected === newProps.selected;
});
