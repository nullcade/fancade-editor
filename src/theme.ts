import { createTheme } from "@mui/material";

export const colors = {
  main: "#28292a"
}

let theme = createTheme({
  palette: {
    mode: "dark",
    area: {
      main: colors.main,
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiStack: {
      styleOverrides: {
        root: {
          alignItems: "stretch",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: theme.spacing(2),
          width: "100%",
          boxSizing: "border-box",
          "> *": {
            flexGrow: 1,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "-webkit-outer-spin-button, -webkit-inner-spin-button": {
            display: "none",
          },
          MozAppearance: "textfield",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.area.main,
          width: "100%",
          height: theme.spacing(8),
          borderRadius: theme.spacing(4),
          alignItems: "center",
        },
      },
    },
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
    MuiTabPanel: {
      styleOverrides: {
        root: {
          width: "100%",
          boxSizing: "border-box",
          height: "calc(100vh - 115px)",
          overflow: "auto",
          padding: 0,
          borderRadius: theme.spacing(2),
        },
      },
    },
  },
});

export default theme;
