import React, { useState, useEffect } from "react";
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
  Add,
  Save,
  Launch,
  DeleteOutline,
} from "@mui/icons-material";
import { Game, GameDataDefault } from "custom_modules/GameFormat";
import FileImport from "components/FileImport";
import FileExport from "components/FileExport";
import theme from "theme";
import ControlledTextField from "components/ControlledTextArea/index.tsx";
import { storeGame, loadGame, listGames, deleteGame } from "./db";

function InfoTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [limitSize, setLimitSize] = useState<boolean>(true);
  const [storingGame, setStoringGame] = useState<boolean>(false);
  const [loadingGame, setLoadingGame] = useState<string | null>(null);
  const [storedGames, setStoredGames] = useState<string[]>([]);

  useEffect(() => {
    listGames().then(setStoredGames);
  }, []);

  function updateTitle() {
    document.title = game.title ? `Editing ${game.title}` : "Fancade Editor";
  }

  useEffect(updateTitle, [game]);

  return (
    <Stack>
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
              gap={theme.spacing(2)}
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
          <Stack direction="row" gap={theme.spacing(2)} sx={{ width: "100%" }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setGame(GameDataDefault)}
              sx={{flexBasis:"100%"}}
            >
              New Game
            </Button>
            <FileImport setFile={setGame} />
            <FileExport game={game} />
          </Stack>
        </Stack>
      </Area>
      <Area>
        <Stack gap={0}>
          <Stack direction="row" gap={theme.spacing(2)} sx={{ width: "100%" }}>
            <LoadingButton
              variant="outlined"
              startIcon={<Save />}
              loading={storingGame}
              onClick={() => {
                setStoringGame(true);
                storeGame(game).then(() => setStoringGame(false));
                if (!storedGames.includes(game.title)) {
                  storedGames.push(game.title);
                  setStoredGames(storedGames.sort());
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
            {storedGames.map((title, i) => (
              <ButtonGroup
                key={i}
                sx={{ boxSizing: "border-box", flexBasis: "45%", flexGrow: 1 }}
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
                <Button
                  size="small"
                  onClick={() => {
                    deleteGame(title);
                    setStoredGames(storedGames.filter((g) => g !== title));
                  }}
                >
                  <DeleteOutline />
                </Button>
              </ButtonGroup>
            ))}
          </Stack>
        </Stack>
      </Area>
    </Stack>
  );
}

export default InfoTab;
