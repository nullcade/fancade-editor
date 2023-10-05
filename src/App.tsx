// import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
// import MyThree from './components/MyThree';
import { Card, Tabs, Tab, SxProps, Theme, ThemeProvider, createTheme } from '@mui/material';
import { FileProvider } from './contexts/fileContext';
import FileImport from './components/FileImport';
import FileExport from './components/FileExport';
import InfoTab from './components/InfoTab';

const tabSx: SxProps<Theme> = {
  color: '#e3e3e3',
  fontWeight: 500,
  fontFamily: "'Custom Sans', sans-serif",
  textTransform: 'none',
  fontSize: '16px',
  lineHeight: '24px',
  flexGrow: '1',
  height: '79px',
  borderRadius: '40px'
}

function App() {
  const [tab, setTab] = useState<0 | 1 | 2>(0);
  const [file, setFile] = useState<ArrayBuffer | null>(null);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <FileProvider value={file}>
        <div className="App">
          {/* <MyThree /> */}
          <Card sx={{
            backgroundColor: '#343636',
            maxWidth: '700px',
            width: 'calc(100% - 6rem)',
            height: 'calc(100% - 6rem)',
            borderRadius: '24px',
            color: '#e3e3e3',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly'
            }}>
              <FileImport setFile={setFile} />
              <h1>Fancade Editor</h1>
              <FileExport />
            </div>
            <Tabs
              value={tab}
              onChange={(a, b) => {
                setTab(b);
              }}
              sx={{
                height: '79px',
                margin: '.5rem 1rem',
                borderRadius: '40px',
                background: '#28292a',
                alignItems: 'center'
              }}
              TabIndicatorProps={{
                sx: {
                  visibility: 'hidden'
                }
              }}
              aria-label="basic tabs example">
              <Tab label="Info" sx={tabSx} />
              <Tab label="Levels" sx={tabSx} />
              <Tab label="Blocks" sx={tabSx} />
            </Tabs>
            <div style={{
              height: '100%',
              overflowY: 'auto'
            }}>
              <InfoTab />
            </div>
          </Card>
        </div>
      </FileProvider>
    </ThemeProvider>
  );
}

export default App;
