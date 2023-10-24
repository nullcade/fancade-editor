import React, { useState, useEffect, useRef } from "react";
import {
  Stack,
  ListItem,
  IconButton,
  Collapse,
  Switch,
  FormControlLabel,
  Button,
  ButtonGroup,
} from "@mui/material";
import Area from "components/Area";
import { LoadingButton } from "@mui/lab";
import {
  ExpandLess,
  ExpandMore,
  Save,
  Launch,
  DeleteOutline,
} from "@mui/icons-material";
import { Game, newGame } from "custom_modules/GameFormat";
import FileImport from "components/FileImport";
import FileExport from "components/FileExport";
import theme from "theme";
import ControlledTextField from "components/ControlledTextArea/index.tsx";
import { storeGame, loadGame, listGames, deleteGame } from "./db";

function sortGames(a: string, b: string) {
  return ({ [a]: -1, [b]: 1 } as Record<string, number | undefined>)["New Game"] ?? a.localeCompare(b);
}

function InfoTab({
  game,
  setGame,
  scroll,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
  scroll: (top: boolean, bottom: boolean) => void;
}) {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [limitSize, setLimitSize] = useState<boolean>(true);
  const [storingGame, setStoringGame] = useState<boolean>(false);
  const [loadingGame, setLoadingGame] = useState<string | null>(null);
  const [storedGames, setStoredGames] = useState<string[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);

  function updateTitle() {
    document.title = game.title ? `Editing ${game.title}` : "Fancade Editor";
  }

  function doScroll() {
    stackRef.current && scroll(
      stackRef.current.scrollTop < 15,
      stackRef.current.scrollTop + 15 > (stackRef.current.scrollHeight - stackRef.current.offsetHeight)
    )
  }

  useEffect(() => {
    async function awaitListGames() {
      const keys = await listGames();
      if (!keys.includes("New Game")) {
        keys.unshift("New Game");
        storeGame(newGame);
      }
      setStoredGames(keys);
    }
    awaitListGames();
  }, []);

  useEffect(updateTitle, [game]);
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
      <Area sx={{ paddingRight: 0 }}>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: 0,
            alignItems: "stretch",
            paddingRight: theme.spacing(6),
          }}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => setAdvanced(!advanced)}
            >
              {advanced ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          }
        >
          <Stack direction="row" flexWrap="wrap">
            <ControlledTextField
              label="Title"
              value={game.title}
              placeholder="New Game"
              setValue={(value) => {
                game.title = value as string;
                setGame(game);
                updateTitle();
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
            <ControlledTextField
              label="Author"
              value={game.author}
              placeholder="Unknown Author"
              setValue={(value) => {
                game.author = value as string;
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
            <ControlledTextField
              label="Description"
              value={game.description}
              placeholder="A Fancade game"
              setValue={(value) => {
                game.description = value as string;
                setGame(game);
              }}
              valueCheck={(event) => {
                if (
                  new TextEncoder().encode(event.target.value as string)
                    .length > (limitSize ? 132 : 255)
                )
                  return String.fromCharCode(
                    ...new TextEncoder()
                      .encode(event.target.value as string)
                      .slice(0, limitSize ? 132 : 255),
                  );
                return event.target.value;
              }}
              multiline
              rows={4}
            />
          </Stack>
          <Collapse in={advanced}>
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ paddingTop: theme.spacing(2) }}
            >
              <ControlledTextField
                label="App Version"
                value={game.appVersion}
                type="number"
                setValue={(value) => {
                  game.appVersion = parseInt(value as string);
                  setGame(game);
                }}
                valueCheck={(event) => {
                  const value = Math.min(
                    Math.max(parseInt(event.target.value), 0),
                    65535,
                  );
                  return `${value}`;
                }}
              />
              <ControlledTextField
                label="ID Offset"
                value={game.idOffset}
                type="number"
                setValue={(value) => {
                  game.idOffset = parseInt(value as string);
                  setGame(game);
                }}
                valueCheck={(event) => {
                  const value = Math.min(
                    Math.max(parseInt(event.target.value), 0),
                    65535,
                  );
                  return `${value}`;
                }}
              />
            </Stack>
          </Collapse>
        </ListItem>
      </Area>
      <Area>
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
      <Area>
        <Stack>
          <Stack direction="row">
            <FileImport setFile={setGame} />
            <FileExport game={game} />
          </Stack>
        </Stack>
      </Area>
      <Area>
        <Stack gap={0}>
          <Stack direction="row">
            <LoadingButton
              variant="outlined"
              startIcon={<Save />}
              loading={storingGame}
              onClick={() => {
                setStoringGame(true);
                storeGame(game).then(() => setStoringGame(false));
                if (!storedGames.includes(game.title)) {
                  storedGames.push(game.title);
                  setStoredGames(storedGames);
                }
              }}
              sx={{ flexGrow: 1 }}
            >
              Save
            </LoadingButton>
          </Stack>
          <Stack
            direction="row"
            paddingTop={storedGames.length ? theme.spacing(2) : 0}
          >
            {storedGames.sort(sortGames).map((title, i) => (
              <ButtonGroup
                key={i}
                sx={{
                  boxSizing: "border-box",
                  flexBasis: title === "New Game" ? "100%" : "45%",
                  flexGrow: 1,
                }}
              >
                <LoadingButton
                  variant="outlined"
                  endIcon={<Launch />}
                  loading={loadingGame === title}
                  onClick={() => {
                    setLoadingGame(title);
                    loadGame(title).then((game) => {
                      setGame(game);
                      setLoadingGame(null);
                    });
                  }}
                  sx={{ flexGrow: 1, whiteSpace: "nowrap" }}
                >
                  Open {title}
                </LoadingButton>
                {title !== "New Game" ? (
                  <Button
                    size="small"
                    onClick={() => {
                      deleteGame(title);
                      setStoredGames(storedGames.filter((g) => g !== title));
                    }}
                  >
                    <DeleteOutline />
                  </Button>
                ) : undefined}
              </ButtonGroup>
            ))}
          </Stack>
        </Stack>
      </Area>
    </Stack>
  );
}

export default InfoTab;
