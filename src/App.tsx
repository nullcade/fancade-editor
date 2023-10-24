import React, { useState } from "react";
import { Stack, Tab, ThemeProvider } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InfoTab from "components/InfoTab";
import { Game, emptyGame } from "custom_modules/GameFormat";
import ChunksTab from "components/ChunksTab";
import DragAndDrop from "components/DragAndDrop";
import theme from "theme";

function App() {
  const [tab, setTab] = useState<"0" | "1" | "2">("0");
  const [file, setFile] = useState<Game.Data>(emptyGame);

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
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexWrap: 'nowrap',
        }}
      >
        <TabContext value={tab}>
          <TabList
            onChange={(a, b) => {
              setTab(b);
            }}
          >
            <Tab label="Info" value="0" />
            <Tab label="Chunks" value="1" />
            <Tab label="Blocks" value="2" />
          </TabList>
          <TabPanel value="0">
            <InfoTab game={file} setGame={setFile} />
          </TabPanel>
          <TabPanel value="1">
            <ChunksTab game={file} setGame={setFile} />
          </TabPanel>
        </TabContext>
        <DragAndDrop setFile={setFile} />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
