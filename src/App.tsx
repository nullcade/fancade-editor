import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Tab,
  ThemeProvider,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InfoTab from "components/InfoTab";
import { Game, GameDecoder, emptyGame } from "custom_modules/GameFormat";
import ChunksTab from "components/ChunksTab";
import DragAndDrop from "components/DragAndDrop";
import theme, { colors } from "theme";
import ScriptTab from "components/ScriptTab";
import { unzip } from "unzipit";
import zlib from "pako";
import { storeGame } from "components/InfoTab/db";

function App() {
  const [tab, setTab] = useState<"0" | "1" | "2">("0");
  const [file, setFile] = useState<Game.Data>(emptyGame);
  const [scroll, setScroll] = useState<{ top: boolean; bottom: boolean }>({
    top: false,
    bottom: false,
  });
  const [loadingZip, setLoadingZip] = useState<boolean>(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (message) => {
        console.log(message);
        setLoadingZip(true);
        (message.data.files as File[]).forEach(async (file) => {
          console.log(file);
          const zip = await unzip(file);
          console.log(zip);
          const entries = Object.values(zip.entries).filter(
            (e) => !e.name.includes(".")
          );
          console.log(entries);
          for await (const entry of entries) {
            console.log(entry);
            try {
              const game = new GameDecoder(
                Buffer.from(zlib.inflate(await entry.arrayBuffer()))
              ).decGame();
              await storeGame(game);
            } finally {
            }
          }
        });
        setLoadingZip(false);
        console.log("hi");
        window.location.reload();
      });
    }
  }, []);

  const tabPanelSx = {
    position: "relative",
    ":before, :after": {
      display: "block",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      content: '""',
      pointerEvents: "none",
      transition: "opacity 200ms ease-in",
      zIndex: 99999,
    },
    ":before": {
      background:
        "linear-gradient(0deg, transparent 85%, rgba(31,31,31,.9) 100%)",
      opacity: scroll.top ? 0 : 1,
    },
    ":after": {
      background:
        "linear-gradient(0deg, rgba(31,31,31,.9) 0%, transparent 15%)",
      opacity: scroll.bottom ? 0 : 1,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack
        className="App"
        sx={{
          maxWidth: "800px",
          margin: "auto",
          padding: theme.spacing(2),
          color: "#e3e3e3",
          textAlign: "center",
          fontFamily: ["Custom Sans", "sans-serif"],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexWrap: "nowrap",
        }}
      >
        <Dialog open={loadingZip}>
          <DialogTitle>Loading</DialogTitle>
          <DialogContent>
            <LinearProgress />
          </DialogContent>
        </Dialog>
        <TabContext value={tab}>
          <TabList
            onChange={(a, b) => {
              setTab(b);
              if (b === "2") {
                setScroll({ top: true, bottom: true });
              }
            }}
          >
            <Tab label="Info" value="0" />
            <Tab label="Chunks" value="1" />
            <Tab label="Scripting" value="2" />
          </TabList>
          <TabPanel value="0" sx={tabPanelSx}>
            <InfoTab
              game={file}
              setGame={setFile}
              scroll={(top: boolean, bottom: boolean) =>
                setScroll({ top, bottom })
              }
            />
          </TabPanel>
          <TabPanel value="1" sx={tabPanelSx}>
            <ChunksTab
              game={file}
              setGame={setFile}
              scroll={(top: boolean, bottom: boolean) =>
                setScroll({ top, bottom })
              }
            />
          </TabPanel>
          <TabPanel
            value="2"
            sx={{
              ...tabPanelSx,
              borderRadius: "8px",
              borderColor: colors.main,
              borderWidth: "2px",
              borderStyle: "solid",
              overflow: "visible",
            }}
          >
            <ScriptTab game={file} setGame={setFile} />
          </TabPanel>
        </TabContext>
        <DragAndDrop setFile={setFile} />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
