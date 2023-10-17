// import logo from './logo.svg';
import React, { useState } from "react";
import "./App.css";
// import MyThree from './components/MyThree';
import { Stack, Tab, ThemeProvider, createTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import FileExport from "./components/FileExport";
import InfoTab from "./components/InfoTab";
import { Game, GameDataDefault } from "./custom_modules/GameFormat";
import ChunksTab from "./components/ChunksTab";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontFamily: "'Custom Sans', sans-serif",
          textTransform: "none",
          fontSize: "16px",
          lineHeight: "24px",
          flexGrow: "1",
          height: "79px",
          borderRadius: "40px",
        },
      },
    },
  },
});

function App() {
  const [tab, setTab] = useState<"0" | "1" | "2">("0");
  const [file, setFile] = useState<Game.Data>(GameDataDefault);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        className="App"
        gap={theme.spacing(2)}
        sx={{
          alignItems: "center",
          justifyContent: "flex-start",
          maxWidth: "800px",
          margin: "auto",
          position: "relative",
          boxSizing: "border-box",
          padding: theme.spacing(2),
          color: "#e3e3e3",
        }}
      >
        <TabContext value={tab}>
          <TabList
            onChange={(a, b) => {
              setTab(b);
            }}
            sx={{
              bgcolor: "#28292a",
              width: "100%",
              height: theme.spacing(8),
              borderRadius: theme.spacing(4),
              alignItems: "center",
            }}
            centered
          >
            <Tab label="Info" value="0" />
            <Tab label="Chunks" value="1" />
            <Tab label="Blocks" value="2" />
          </TabList>
          <TabPanel value="0" sx={{ width: "100%", paddingY: "0" }}>
            <InfoTab game={file} setGame={setFile} />
          </TabPanel>
          <TabPanel value="1" sx={{ width: "100%", paddingY: "0" }}>
            <ChunksTab game={file} setGame={setFile} />
          </TabPanel>
        </TabContext>

        <FileExport game={file} />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
