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
import ControlledTextField from "../ControlledTextArea/index.tsx";

function ChunkListItem({
  value,
  update,
  selected,
  select,
}: {
  value: Chunk.Data;
  update: () => void;
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
        <ControlledTextField
          label="Name"
          defaultValue={value.name}
          setValue={(name) => {
            value.name = name;
            update();
          }}
        />

        <ControlledTextField
          label="ID"
          defaultValue={value.id}
          setValue={(id) => {
            value.id = id;
            update();
          }}
        />
        <Checkbox
          defaultChecked={value.locked}
          icon={<LockOpen />}
          checkedIcon={<Lock />}
          onChange={(event) => {
            value.locked = event.target.value;
            update();
          }}
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
                  <ControlledTextField
                    label="X"
                    defaultValue={chunk.offset[0]}
                    setValue={(x) => {
                      chunk.offset[0] = x;
                      update();
                    }}
                  />
                  <ControlledTextField
                    label="Y"
                    defaultValue={chunk.offset[1]}
                    setValue={(y) => {
                      chunk.offset[1] = y;
                      update();
                    }}
                  />
                  <ControlledTextField
                    label="Z"
                    defaultValue={chunk.offset[2]}
                    setValue={(z) => {
                      chunk.offset[2] = z;
                      update();
                    }}
                  />
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
