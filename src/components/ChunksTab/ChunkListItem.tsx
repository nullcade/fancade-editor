import React, { memo, useState, useEffect } from "react";
import { Chunk } from "custom_modules/GameFormat/types";
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
import theme from "theme";
import ControlledTextField from "components/ControlledTextArea/index.tsx";

function ChunkListItem({
  value,
  update,
  selected,
  select,
  index,
}: {
  value: Chunk.Data;
  update: () => void;
  selected: boolean;
  select: () => void;
  index: number;
}) {
  const [afterSelected, setAfterSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selected) setAfterSelected(selected);
    else setTimeout(() => setAfterSelected(selected), 300);
  }, [selected]);

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
        value.children &&
        <IconButton edge="end" aria-label="comments" onClick={select}>
          {selected ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      }
    >
      <Stack direction="row">
        <FormControl sx={{ flexGrow: 0 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            IconComponent={() => null}
            defaultValue={value.type}
            onChange={(event) => {
              value.type = event.target.value as Chunk.Type;
              update();
            }}
            sx={{
              height: theme.spacing(7),
              width: theme.spacing(7),
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
          sx={{ flexBasis: 0 }}
        />
        <Checkbox
          defaultChecked={value.locked}
          icon={<LockOpen />}
          checkedIcon={<Lock />}
          onChange={(event) => {
            value.locked = event.target.checked;
            update();
          }}
          sx={{ flexGrow: 0 }}
        />
      </Stack>
      {selected || afterSelected ? (
        <Collapse
          in={selected && afterSelected}
          sx={{ width: "100%", boxSizing: "border-box" }}
        >
          <Stack sx={{ paddingTop: theme.spacing(2) }}>
            {value.children?.map((chunk, i) => chunk.offset &&
              <Stack key={i} direction="row" flexWrap="nowrap">
                <ControlledTextField
                  label="X"
                  value={chunk.offset[0]}
                  setValue={(x) => {
                    if (chunk.offset) {
                      chunk.offset[0] = x as number;
                      update();
                    }
                  }}
                />
                <ControlledTextField
                  label="Y"
                  defaultValue={chunk.offset[1]}
                  setValue={(y) => {
                    if (chunk.offset) {
                      chunk.offset[1] = y as number;
                      update();
                    }
                  }}
                />
                <ControlledTextField
                  label="Z"
                  defaultValue={chunk.offset[2]}
                  setValue={(z) => {
                    if (chunk.offset) {
                      chunk.offset[2] = z as number;
                      update();
                    }
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Collapse>
      ) : undefined}
    </ListItem>
  );
}

export default memo(ChunkListItem, (prevProps, newProps) => {
  return prevProps.selected === newProps.selected;
});
