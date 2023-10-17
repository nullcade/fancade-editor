import { createTheme } from "@mui/material";

export default createTheme({
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
