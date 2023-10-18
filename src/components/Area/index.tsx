import { Box, BoxProps } from "@mui/material";
import theme from "theme";

// Would have themed the Box component directly in the theme, but that didnt work
export default function Area(props: BoxProps) {
  const newProps = {
    ...props,
    sx: {
      backgroundColor: theme.palette.area.main,
      borderRadius: theme.spacing(2),
      padding: theme.spacing(2),
      ...props.sx,
    },
  };
  return <Box {...newProps}></Box>;
}
