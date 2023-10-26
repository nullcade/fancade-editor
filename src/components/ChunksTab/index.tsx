import React, { useEffect, useState, useRef } from "react";
import { FormControl, InputLabel, MenuItem, Select, Stack, Divider, FormControlLabel, Switch } from "@mui/material";
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
} from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import Area from "components/Area";
import ControlledTextField from "components/ControlledTextArea/index.tsx";
import theme from "theme";

function ChunksTab({
  game,
  setGame,
  scroll,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
  scroll: (top: boolean, bottom: boolean) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const stackRef = useRef<HTMLDivElement>(null);
  const [chunk, setChunk] = React.useState<string>('');
  const [limitSize, setLimitSize] = useState<boolean>(true);

  const handleChange = (event: SelectChangeEvent) => {
    setChunk(event.target.value);
  };

  function doScroll() {
    stackRef.current && scroll(
      stackRef.current.scrollTop < 15,
      stackRef.current.scrollTop + 15 > (stackRef.current.scrollHeight - stackRef.current.offsetHeight)
    )
  }

  useEffect(doScroll);

  return (
    <Stack
      justifyContent="flex-start"
      flexWrap="nowrap"
      sx={{
        overflowY: "scroll",
        height: "fit-content",
        maxHeight: '100%',
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        ":-webkit-scrollbar": {
          display: "none"
        }
      }}
      ref={stackRef}
      onScroll={event => doScroll()}
      onResize={event => doScroll()}
    >
      <Area>
        <Stack sx={{
          textAlign: "left",
          ".MuiInputBase-input": {
            display: "flex",
          },
        }}>
          <FormControl fullWidth>
            <InputLabel>Chunk</InputLabel>
            <Select
              value={chunk}
              label="Chunk"
              onChange={handleChange}
            >
              {
                game.chunks.map(
                  (item, index) =>
                    <MenuItem value={index} key={index}>
                      {
                        item.type === Chunk.Type.Rigid ? <ViewInArRounded sx={{
                          marginRight: ".5rem"
                        }} /> :
                          item.type === Chunk.Type.Physics ? <SportsFootball sx={{
                            marginRight: ".5rem"
                          }} /> :
                            item.type === Chunk.Type.Script ? <DataObject sx={{
                              marginRight: ".5rem"
                            }} /> :
                              item.type === Chunk.Type.Level ? <Save sx={{
                                marginRight: ".5rem"
                              }} /> :
                                <></>
                      }
                      {item.name}
                    </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Stack>
      </Area>
      <Area sx={{
        display: chunk !== '' ? undefined : "none"
      }}>
        <Stack flexDirection="row">
          <FormControl
            fullWidth
            sx={{
              flexGrow: 0,
              width: 'fit-content',
            }}
          >
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              IconComponent={() => null}
              value={chunk !== '' && game.chunks[parseInt(chunk)].type || 0}
              onChange={(event) => {
                game.chunks[parseInt(chunk)].type = event.target.value as Chunk.Type;
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
            label="Name"
            value={chunk !== '' ? game.chunks[parseInt(chunk)].name : ''}
            placeholder={chunk !== '' && game.chunks[parseInt(chunk)].type === Chunk.Type.Level ? `Level ${parseInt(chunk) + 1}` : "New Block"}
            setValue={(value) => {
              game.chunks[parseInt(chunk)].name = value as string;
              setGame(game);
            }}
            valueCheck={(event) => {
              if (
                new TextEncoder().encode(event.target.value as string)
                  .length > (limitSize ? 16 : 255)
              )
                return String.fromCharCode(
                  ...new TextEncoder()
                    .encode(event.target.value as string)
                    .slice(0, limitSize ? 16 : 255),
                );
              return event.target.value;
            }}
          />
        </Stack>
      </Area>
      <Area sx={{
        display: chunk === '' ? "none" : undefined
      }}>
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
      </Area>
    </Stack>
  );
}

export default ChunksTab;
