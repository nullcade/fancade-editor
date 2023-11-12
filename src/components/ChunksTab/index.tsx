import React, { useEffect, useState, useRef } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  FormControlLabel,
  Switch,
  Checkbox,
  Button,
} from "@mui/material";
import { Game, Chunk } from "custom_modules/GameFormat";
import {
  ExpandLess,
  ExpandMore,
  Lock,
  LockOpen,
  SportsFootball,
  DataObject,
  Save,
  ViewInArRounded,
  AddRounded,
  DeleteOutline,
} from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import Area from "components/Area";
import ControlledTextField from "components/ControlledTextArea/index.tsx";
import theme from "theme";
import { nanoid } from "nanoid";
import OffsetInput from "components/OffsetInput";

function ChunksTab({
  game,
  setGame,
  scroll,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
  scroll: (top: boolean, bottom: boolean) => void;
}) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [chunk, setChunk] = React.useState<string>("");
  const [childChunk, setChildChunk] = React.useState<string>("");
  const [limitSize, setLimitSize] = useState<boolean>(true);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "NEW") {
      setChunk(event.target.value);
      return;
    }
    setChildChunk("");
    setChunk(
      (
        game.chunks.push({
          uuid: nanoid(),
          name: "New Chunk",
          type: Chunk.Type.Rigid,
          locked: false,
          blocks: [],
          values: [],
          wires: [],
        }) - 1
      ).toString()
    );
  };

  function doScroll() {
    stackRef.current &&
      scroll(
        stackRef.current.scrollTop < 15,
        stackRef.current.scrollTop + 15 >
          stackRef.current.scrollHeight - stackRef.current.offsetHeight
      );
  }

  useEffect(doScroll);

  return (
    <Stack
      justifyContent="flex-start"
      flexWrap="nowrap"
      sx={{
        overflowY: "scroll",
        height: "fit-content",
        maxHeight: "100%",
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        ":-webkit-scrollbar": {
          display: "none",
        },
      }}
      ref={stackRef}
      onScroll={(event) => doScroll()}
      onResize={(event) => doScroll()}
    >
      <Area>
        <Stack
          sx={{
            textAlign: "left",
            ".MuiInputBase-input": {
              display: "flex",
            },
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Chunk</InputLabel>
            <Select value={chunk} label="Chunk" onChange={handleChange}>
              {game.chunks.map((item, index) => (
                <MenuItem value={index} key={index}>
                  {item.type === Chunk.Type.Rigid ? (
                    <ViewInArRounded
                      sx={{
                        marginRight: ".5rem",
                      }}
                    />
                  ) : item.type === Chunk.Type.Physics ? (
                    <SportsFootball
                      sx={{
                        marginRight: ".5rem",
                      }}
                    />
                  ) : item.type === Chunk.Type.Script ? (
                    <DataObject
                      sx={{
                        marginRight: ".5rem",
                      }}
                    />
                  ) : item.type === Chunk.Type.Level ? (
                    <Save
                      sx={{
                        marginRight: ".5rem",
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {item.name}
                </MenuItem>
              ))}
              <MenuItem value="NEW">
                <AddRounded
                  sx={{
                    marginRight: ".5rem",
                  }}
                />
                New Chunk
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Area>
      <Area
        sx={{
          display: chunk !== "" ? undefined : "none",
        }}
      >
        <Stack flexDirection="row">
          <Button
            variant="outlined"
            startIcon={<DeleteOutline />}
            color="error"
            onClick={() => {
              if (isNaN(parseInt(chunk))) return;
              delete game.chunks[parseInt(chunk)];
              setChildChunk("");
              setChunk("");
              setGame(game);
            }}
            sx={{
              width: "100%",
            }}
          >
            Delete Chunk
          </Button>
          <FormControl
            fullWidth
            sx={{
              flexGrow: 0,
              width: "fit-content",
            }}
          >
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              IconComponent={() => null}
              value={(chunk !== "" && game.chunks[parseInt(chunk)].type) || 0}
              onChange={(event) => {
                game.chunks[parseInt(chunk)].type = event.target
                  .value as Chunk.Type;
                setGame(game);
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
            sx={{
              flexShrink: 10,
            }}
            label="Name"
            value={chunk !== "" ? game.chunks[parseInt(chunk)].name : ""}
            placeholder={
              chunk !== "" &&
              game.chunks[parseInt(chunk)].type === Chunk.Type.Level
                ? `Level ${parseInt(chunk) + 1}`
                : "New Block"
            }
            setValue={(value) => {
              game.chunks[parseInt(chunk)].name = value as string;
              setGame(game);
            }}
            valueCheck={(event) => {
              if (
                new TextEncoder().encode(event.target.value as string).length >
                (limitSize ? 16 : 255)
              )
                return String.fromCharCode(
                  ...new TextEncoder()
                    .encode(event.target.value as string)
                    .slice(0, limitSize ? 16 : 255)
                );
              return event.target.value;
            }}
          />
          <Stack
            sx={{
              width: "fit-content",
              flexGrow: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Checkbox
              defaultChecked={
                chunk !== "" && game.chunks[parseInt(chunk)].locked
              }
              icon={<LockOpen />}
              checkedIcon={<Lock />}
              onChange={(event) => {
                game.chunks[parseInt(chunk)].locked = event.target.checked;
                setGame(game);
              }}
              sx={{
                flexGrow: 0,
                aspectRatio: "1/1",
              }}
            />
          </Stack>
          <OffsetInput
            sx={{
              minWidth: "4rem",
            }}
            label="Offset"
            value={
              chunk !== ""
                ? game.chunks[parseInt(chunk)].offset ?? [0, 0, 0]
                : [0, 0, 0]
            }
            setValue={(value) => {
              game.chunks[parseInt(chunk)].offset = value;
              setGame(game);
            }}
            valueCheck={(event) => {
              if (
                parseInt(event.target.value as string) > (limitSize ? 3 : 255)
              )
                return limitSize ? 3 : 255;
              if (parseInt(event.target.value as string) < 0) return 0;
              return parseInt(event.target.value as string);
            }}
          />
        </Stack>
      </Area>
      <Area
        sx={{
          display: chunk === "" ? "none" : undefined,
        }}
      >
        <Stack>
          <FormControlLabel
            label="Limit input size"
            control={
              <Switch
                checked={limitSize}
                onChange={(event) => {
                  setLimitSize(event.target.checked);
                }}
              />
            }
          />
        </Stack>
        <Stack></Stack>
      </Area>
    </Stack>
  );
}

export default ChunksTab;
