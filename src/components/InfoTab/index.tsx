import React, { useState, useEffect } from "react";
import {
  Stack,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Report, ReportOutlined } from "@mui/icons-material";
import { Game } from "../../custom_modules/GameFormat";
import { theme } from "../../App.tsx";
import ControlledTextField from "../ControlledTextArea/index.tsx";

function InfoTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [unstable, setUnstable] = useState<boolean>(false);

  function updateTitle() {
    document.title = game.title ? `Editing ${game.title}` : "Fancade Editor";
  }

  useEffect(updateTitle, [game]);

  return (
    <List
      sx={{
        gap: theme.spacing(4),
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
          ".MuiListItemSecondaryAction-root": {
            height: "100%",
          },
        }}
        secondaryAction={
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
              poition: "relative",
            }}
          >
            <Checkbox
              onChange={(event) => setUnstable(event.target.checked)}
              sx={{
                position: "absolute",
                top: ".5rem",
              }}
              icon={<ReportOutlined />}
              checkedIcon={<Report />}
            />
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => setAdvanced(!advanced)}
            >
              {advanced ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
        }
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={theme.spacing(2)}
          sx={{ paddingRight: theme.spacing(4) }}
        >
          <ControlledTextField
            label="Title"
            value={game.title}
            placeholder="New Game"
            variant="outlined"
            sx={{ flexGrow: 1 }}
            setValue={(value) => {
              game.title = value as string;
              setGame(game);
              updateTitle();
            }}
            valueCheck={(event) => {
              if (
                new TextEncoder().encode(event.target.value as string).length >
                (unstable ? 255 : 16)
              )
                return String.fromCharCode(
                  ...new TextEncoder()
                    .encode(event.target.value as string)
                    .slice(0, unstable ? 255 : 16),
                );
              return event.target.value;
            }}
          />
          <ControlledTextField
            label="Author"
            value={game.author}
            placeholder="Unknown Author"
            variant="outlined"
            sx={{ flexGrow: 1 }}
            setValue={(value) => {
              game.author = value as string;
              setGame(game);
            }}
            valueCheck={(event) => {
              if (
                new TextEncoder().encode(event.target.value as string).length >
                (unstable ? 255 : 16)
              )
                return String.fromCharCode(
                  ...new TextEncoder()
                    .encode(event.target.value as string)
                    .slice(0, unstable ? 255 : 16),
                );
              return event.target.value;
            }}
          />
          <ControlledTextField
            label="Description"
            value={game.description}
            placeholder="A Fancade game"
            variant="outlined"
            sx={{ flexGrow: 2 }}
            setValue={(value) => {
              game.description = value as string;
              setGame(game);
            }}
            valueCheck={(event) => {
              if (
                new TextEncoder().encode(event.target.value as string).length >
                (unstable ? 255 : 132)
              )
                return String.fromCharCode(
                  ...new TextEncoder()
                    .encode(event.target.value as string)
                    .slice(0, unstable ? 255 : 132),
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
            sx={{ paddingRight: theme.spacing(4) }}
          >
            <ControlledTextField
              label="App Version"
              value={game.appVersion}
              type="number"
              variant="outlined"
              sx={{
                flexGrow: 1,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              setValue={(value) => {
                game.appVersion = parseInt(value as string);
                setGame(game);
              }}
              valueCheck={(event) => {
                if (
                  Number.isNaN(parseInt(event.target.value)) ||
                  parseInt(event.target.value) < 0
                )
                  return "0";
                else if (parseInt(event.target.value) > 65535) return "65535";
                return event.target.value;
              }}
            />
            <ControlledTextField
              label="ID Offset"
              value={game.idOffset}
              type="number"
              variant="outlined"
              sx={{
                flexGrow: 1,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              setValue={(value) => {
                game.idOffset = parseInt(value as string);
                setGame(game);
              }}
              valueCheck={(event) => {
                if (
                  Number.isNaN(parseInt(event.target.value)) ||
                  parseInt(event.target.value) < 0
                )
                  return "0";
                else if (parseInt(event.target.value) > 65535) return "65535";
                return event.target.value;
              }}
            />
          </Stack>
        </Collapse>
      </ListItem>
    </List>
  );
}

export default InfoTab;
