import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Slider,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Chunk } from "custom_modules/GameFormat";
import React, { useState } from "react";
import getColors from "./getColors";

const colors: {
  [key: number]: string;
} = {
  0x00: "#00000000",
  0x01: "#1E1E26",
  0x02: "#424252",
  0x03: "#696B7C",
  0x04: "#9699A9",
  0x05: "#C6C9D3",
  0x06: "#FFFFFF",
  0x07: "#985660",
  0x08: "#C57184",
  0x09: "#E79F9D",
  0x0a: "#FFBCAE",
  0x0b: "#FFDFC8",
  0x0c: "#FFF9F7",
  0x0d: "#C73853",
  0x0e: "#FF4E6F",
  0x0f: "#FFA4A4",
  0x10: "#D15544",
  0x11: "#FF7758",
  0x12: "#FFB389",
  0x13: "#F0B300",
  0x14: "#FFE200",
  0x15: "#FFFF81",
  0x16: "#008F50",
  0x17: "#45C952",
  0x18: "#BBFF72",
  0x19: "#0071E5",
  0x1a: "#0096FF",
  0x1b: "#00C9FF",
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FacesDialog({
  open,
  handleClose,
  chunk,
}: {
  open: boolean;
  handleClose: () => void;
  chunk?: Chunk.Data;
}) {
  const [side, setSide] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [layer, setLayer] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>(0);
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>{"Block Faces"}</DialogTitle>
      <DialogContent>
        <Stack flexDirection="row" flexWrap="nowrap">
          <Stack gap="2px" flexDirection="column" flexWrap="nowrap">
            {chunk &&
              chunk.faces &&
              chunk.faces[0].map((_, y) => (
                <Stack key={y} gap="2px" flexDirection="row" flexWrap="nowrap">
                  {chunk.faces &&
                    chunk.faces[0].map((_, x) => {
                      if (chunk.faces) {
                        const color = getColors(chunk.faces, layer, side, x, y);
                        return (
                          <ButtonBase
                            key={x}
                            sx={{
                              width: "3rem",
                              height: "3rem",
                              background:
                                !(color & 0x80) && color !== 0x00
                                  ? `radial-gradient(circle, ${
                                      colors[color & 0x7f]
                                    } 30%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 40%, ${
                                      colors[color & 0x7f]
                                    } 45%)`
                                  : colors[color & 0x7f],
                            }}
                          />
                        );
                      }
                      return undefined;
                    })}
                </Stack>
              ))}
          </Stack>
          <Slider
            sx={{
              height: "auto",
              marginY: "1rem",
            }}
            value={layer + 1}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={8}
            onChange={(_, value) =>
              typeof value === "number" &&
              setLayer((value - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)
            }
            orientation="vertical"
          />
        </Stack>
        <Slider
          sx={{
            width: "calc(100% - 3rem)",
          }}
          value={side + 1}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={6}
          onChange={(_, value) =>
            typeof value === "number" &&
            setSide((value - 1) as 0 | 1 | 2 | 3 | 4 | 5)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FacesDialog;
