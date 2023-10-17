import React, { memo } from "react";
import { Chunk } from "../../custom_modules/GameFormat/types";
import {
  Checkbox,
  IconButton,
  ListItem,
  Stack,
  Collapse,
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
  Save,
  ViewInArRounded,
} from "@mui/icons-material";
import theme from "../../theme";
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
    <ListItem
      sx={{
        flexWrap: "wrap",
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2),
        paddingRight: theme.spacing(6),
        bgcolor: "#28292a",
      }}
      secondaryAction={
        <IconButton edge="end" aria-label="comments" onClick={select}>
          {selected ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      }
    >
      <Stack
        direction="row"
        gap={theme.spacing(2)}
        sx={{ width: "100%", boxSizing: "border-box" }}
      >
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            variant="outlined"
            IconComponent={() => null}
            defaultValue={value.type}
            onChange={(event) => {
              value.type = event.target.value as Chunk.Type;
              update();
            }}
            sx={{
              height: theme.spacing(7),
              width: theme.spacing(7),
              ".MuiSelect-select": {
                position: "relative",
              },
              svg: {
                height: `calc(${theme.spacing(7)} * 0.65)`,
                width: `calc(${theme.spacing(7)} * 0.65)`,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              },
            }}
          >
            <MenuItem value={Chunk.Type.Rigid}>
              <ViewInArRounded />
            </MenuItem>
            <MenuItem value={Chunk.Type.Physics}>
              <SportsFootball />
            </MenuItem>
            <MenuItem value={Chunk.Type.Script}>
              <DataObject />
            </MenuItem>
            <MenuItem value={Chunk.Type.Level}>
              <Save />
            </MenuItem>
          </Select>
        </FormControl>
        <ControlledTextField
          label="Name"
          defaultValue={value.name}
          setValue={(name) => {
            value.name = name as string;
            update();
          }}
          sx={{ flexGrow: 1 }}
        />
        <Checkbox
          defaultChecked={value.locked}
          icon={<LockOpen />}
          checkedIcon={<Lock />}
          onChange={(event) => {
            value.locked = event.target.checked;
            update();
          }}
        />
      </Stack>

      <Collapse in={selected} sx={{ width: "100%", boxSizing: "border-box" }}>
        <Stack gap={theme.spacing(2)} sx={{ paddingTop: theme.spacing(2) }}>
          <ControlledTextField
            label="ID"
            defaultValue={value.id}
            setValue={(id) => {
              value.id = id as number;
              update();
            }}
          />
          {value.children?.map((chunk) => (
            <Stack direction="row" gap={theme.spacing(2)}>
              <ControlledTextField
                label="X"
                value={chunk.offset[0]}
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
          ))}
        </Stack>
      </Collapse>
    </ListItem>
  );
}

export default memo(ChunkListItem, (prevProps, newProps) => {
  return prevProps.selected === newProps.selected;
});
