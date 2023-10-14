import React, { useState } from "react";
import {
  Stack,
  List,
  ListItem,
  TextField,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Game } from "../../custom_modules/GameFormat";
import { theme } from "../../App.tsx";

function InfoTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const [advanced, setAdvanced] = useState<boolean>(false);

  return (
    <List
      gap={theme.spacing(4)}
      sx={{
        alignItems: "center",
        justifyContent: "start",
        fleListItem: "wrap",
        width: "fit-content",
      }}
    >
      <ListItem
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
          borderRadius: theme.spacing(2),
          padding: theme.spacing(2),
          bgcolor: "#28292a",
          alignItems: "stretch",
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
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={theme.spacing(2)}
          sx={{ paddingRight: theme.spacing(4) }}
        >
          <TextField
            label="Title"
            defaultValue={game.title}
            placeholder="New Game"
            sx={{ flexGrow: 1 }}
            onChange={(event) => {
              game.title = event.target.value;
              setGame(game);
            }}
          />
          <TextField
            label="Author"
            defaultValue={game.author}
            placeholder="Unknown Author"
            sx={{ flexGrow: 1 }}
            onChange={(event) => {
              game.author = event.target.value;
              setGame(game);
            }}
          />
          <TextField
            label="Description"
            defaultValue={game.description}
            placeholder="A Fancade game"
            multiline
            sx={{ flexGrow: 1 }}
            onChange={(event) => {
              game.description = event.target.value;
              setGame(game);
            }}
          />
        </Stack>
        <Collapse in={advanced}>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={theme.spacing(2)}
            sx={{ paddingRight: theme.spacing(4) }}
          >
            <TextField
              label="App Version"
              defaultValue={game.appVersion}
              sx={{ flexGrow: 1 }}
              onChange={(event) => {
                game.appVersion = parseInt(event.target.value);
                setGame(game);
              }}
            />
            <TextField
              label="ID Offset"
              defaultValue={game.idOffset}
              sx={{ flexGrow: 1 }}
              onChange={(event) => {
                game.idOffset = parseInt(event.target.value);
                setGame(game);
              }}
            />
          </Stack>
        </Collapse>
      </ListItem>
    </List>
  );
}

export default InfoTab;
