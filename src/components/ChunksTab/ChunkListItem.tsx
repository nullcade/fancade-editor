import React, { memo } from "react";
import { Chunk } from "../../custom_modules/GameFormat/types";
import {
  Checkbox,
  IconButton,
  ListItem,
  Stack,
  Collapse,
  List,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Lock,
  LockOpen,
  SportsFootball,
  DataObject,
  Layers,
  ViewInAr,
} from "@mui/icons-material";
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
          flexWrap: "wrap",
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
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            variant="outlined"
            IconComponent={() => null}
            defaultValue={value.type}
            onChange={(event) => {
              value.type = event.target.value;
              update();
            }}
            sx={{ 
              height: theme.spacing(7),
              width: theme.spacing(7),
              ".MuiSelect-select": {
                position: "relative"
              },
              "svg": {
                height: `calc(${theme.spacing(7)} * 0.65)`,
                width: `calc(${theme.spacing(7)} * 0.65)`,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }
            }}
          >
            <MenuItem value={Chunk.Type.Rigid}>
              <ViewInAr />
            </MenuItem>
            <MenuItem value={Chunk.Type.Physics}>
              <SportsFootball />
            </MenuItem>
            <MenuItem value={Chunk.Type.Script}>
              <DataObject />
            </MenuItem>
            <MenuItem value={Chunk.Type.Level}>
              <Layers />
            </MenuItem>
          </Select>
        </FormControl>

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
          <List sx={{ paddingRight: theme.spacing(8) }}>
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
