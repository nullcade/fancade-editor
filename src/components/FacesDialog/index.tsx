import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Chunk } from "custom_modules/GameFormat";
import React, { useRef, useState } from "react";
import ControlledTextField from "components/ControlledTextArea";
import {
  AddRounded,
  Brush,
  CenterFocusWeakRounded,
  ClearRounded,
  RemoveRounded,
} from "@mui/icons-material";
import { GithubPicker } from "react-color";
import tinycolor from "tinycolor2";
import getFace from "./getFace";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
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
  chunk?: Omit<Chunk.Data, "type" | "locked">;
}) {
  const transparentBorderColor = "#888888";
  const webColors: {
    [key: number]: string;
  } = {
    0x00: "#00000000",
    0x01: "#1E1E28",
    0x02: "#434352",
    0x03: "#6A6C7D",
    0x04: "#989BAA",
    0x05: "#C9CBD4",
    0x06: "#FFFFFF",
    0x07: "#9A5862",
    0x08: "#C77285",
    0x09: "#E9A19E",
    0x0a: "#FFBEAF",
    0x0b: "#FFE1CA",
    0x0c: "#FFE4E4",
    0x0d: "#C93954",
    0x0e: "#FF4F70",
    0x0f: "#FFA5A5",
    0x10: "#D35645",
    0x11: "#FF7858",
    0x12: "#FFB48A",
    0x13: "#F1B400",
    0x14: "#FFE300",
    0x15: "#FFFF82",
    0x16: "#008F50",
    0x17: "#45CB52",
    0x18: "#BDFF73",
    0x19: "#0072E6",
    0x1a: "#0096FF",
    0x1b: "#00C9FF",
    0x1c: "#6E58A9",
    0x1d: "#9476E4",
    0x1e: "#BA93FF",
    0x1f: "#F777B4",
    0x20: "#FF9EDA",
    0x21: "#FFC4F4",
    0x22: "#000000",
    0x23: "#000000",
    0x24: "#001700",
    0x25: "#002000",
    0x26: "#002900",
    0x27: "#002300",
    0x28: "#002B00",
    0x29: "#00401E",
    0x2a: "#000924",
    0x2b: "#00002D",
    0x2c: "#000026",
    0x2d: "#000031",
    0x2e: "#000040",
    0x2f: "#000015",
    0x30: "#000005",
    0x31: "#00002C",
    0x32: "#000032",
    0x33: "#000020",
    0x34: "#000072",
    0x35: "#000049",
    0x36: "#000072",
    0x37: "#000072",
    0x38: "#000000",
    0x39: "#0C0600",
    0x3a: "#000000",
    0x3b: "#080000",
    0x3c: "#021600",
    0x3d: "#011600",
    0x3e: "#375004",
    0x3f: "#002A00",
    0x40: "#001D00",
    0x41: "#00160D",
    0x42: "#000916",
    0x43: "#00022D",
    0x44: "#000D00",
    0x45: "#000000",
    0x46: "#002222",
    0x47: "#2B4343",
    0x48: "#51696A",
    0x49: "#7B8D8F",
    0x4a: "#A0BABC",
    0x4b: "#C8FFFF",
    0x4c: "#FF5D42",
    0x4d: "#4EA164",
    0x4e: "#72C48B",
    0x4f: "#9AEDAB",
    0x50: "#90FFE3",
    0x51: "#D0FFFF",
    0x52: "#F7A533",
    0x53: "#37FF5A",
    0x54: "#64FFCD",
    0x55: "#CDDE62",
    0x56: "#36FF94",
    0x57: "#5BFFBA",
    0x58: "#86FFEC",
    0x59: "#57FFFB",
    0x5a: "#91FFFF",
    0x5b: "#EF157B",
    0x5c: "#5036D9",
    0x5d: "#7DCFFF",
    0x5e: "#84195A",
    0x5f: "#9800CB",
    0x60: "#FF74F2",
    0x61: "#FF5741",
    0x62: "#769686",
    0x63: "#DDE9E4",
    0x64: "#FFDD59",
    0x65: "#87FFA7",
    0x66: "#E4FFCC",
    0x67: "#F00000",
    0x68: "#000000",
    0x69: "#000000",
    0x6a: "#130003",
    0x6b: "#191A29",
    0x6c: "#4A4856",
    0x6d: "#58446A",
    0x6e: "#536EA6",
    0x6f: "#390015",
    0x70: "#3A000A",
    0x71: "#4C0000",
    0x72: "#8D2B2F",
    0x73: "#90383A",
    0x74: "#A02E2F",
    0x75: "#3C0023",
    0x76: "#7C0024",
    0x77: "#B13838",
    0x78: "#952200",
    0x79: "#AB2E03",
    0x7a: "#B1432F",
    0x7b: "#9F4812",
    0x7c: "#C36A22",
    0x7d: "#DB711A",
    0x7e: "#00332F",
    0x7f: "#002629",
  };

  const colors: {
    [key: number]: string;
  } = {
    0x00: "#00000000",
    0x01: "#1E1E28",
    0x02: "#434352",
    0x03: "#6A6C7D",
    0x04: "#989BAA",
    0x05: "#C9CBD4",
    0x06: "#FFFFFF",
    0x07: "#9A5862",
    0x08: "#C77285",
    0x09: "#E9A19E",
    0x0a: "#FFBEAF",
    0x0b: "#FFE1CA",
    0x0c: "#FFE4E4",
    0x0d: "#C93954",
    0x0e: "#FF4F70",
    0x0f: "#FFA5A5",
    0x10: "#D35645",
    0x11: "#FF7858",
    0x12: "#FFB48A",
    0x13: "#F1B400",
    0x14: "#FFE300",
    0x15: "#FFFF82",
    0x16: "#008F50",
    0x17: "#45CB52",
    0x18: "#BDFF73",
    0x19: "#0072E6",
    0x1a: "#0096FF",
    0x1b: "#00C9FF",
    0x1c: "#6E58A9",
    0x1d: "#9476E4",
    0x1e: "#BA93FF",
    0x1f: "#F777B4",
    0x20: "#FF9EDA",
    0x21: "#FFC4F4",
    0x22: "#010000",
    0x23: "#00001D",
    0x24: "#000024",
    0x25: "#010028",
    0x26: "#010021",
    0x27: "#00002D",
    0x28: "#00003D",
    0x29: "#1F000A",
    0x2a: "#260002",
    0x2b: "#2D0000",
    0x2c: "#260002",
    0x2d: "#330001",
    0x2e: "#400000",
    0x2f: "#150001",
    0x30: "#040000",
    0x31: "#290006",
    0x32: "#330000",
    0x33: "#210003",
    0x34: "#740000",
    0x35: "#490000",
    0x36: "#780000",
    0x37: "#720001",
    0x38: "#000B05",
    0x39: "#000103",
    0x3a: "#000900",
    0x3b: "#000115",
    0x3c: "#000115",
    0x3d: "#02344F",
    0x3e: "#050029",
    0x3f: "#000016",
    0x40: "#000014",
    0x41: "#100004",
    0x42: "#140200",
    0x43: "#2B030E",
    0x44: "#020000",
    0x45: "#24202E",
    0x46: "#444353",
    0x47: "#696A7E",
    0x48: "#8C8FA0",
    0x49: "#B3BFCC",
    0x4a: "#FEFFFF",
    0x4b: "#5F404F",
    0x4c: "#9E6577",
    0x4d: "#BF8D9C",
    0x4e: "#E7AD97",
    0x4f: "#FFE3D1",
    0x50: "#FFFEF5",
    0x51: "#A8323B",
    0x52: "#FF5764",
    0x53: "#FFCDCE",
    0x54: "#E06134",
    0x55: "#FD9659",
    0x56: "#FFBA86",
    0x57: "#FFE964",
    0x58: "#FFFB90",
    0x59: "#FFFFF9",
    0x5a: "#157A51",
    0x5b: "#32DB7F",
    0x5c: "#CCFF7F",
    0x5d: "#175B9A",
    0x5e: "#05CBF1",
    0x5f: "#6CF4FF",
    0x60: "#564278",
    0x61: "#9488DC",
    0x62: "#E6E7FB",
    0x63: "#DC5989",
    0x64: "#FEA8E7",
    0x65: "#FFCCEE",
    0x66: "#020002",
    0x67: "#000300",
    0x68: "#150006",
    0x69: "#161A2D",
    0x6a: "#4A4853",
    0x6b: "#57446A",
    0x6c: "#506FA6",
    0x6d: "#370014",
    0x6e: "#39000B",
    0x6f: "#4C0000",
    0x70: "#8F2A2E",
    0x71: "#923634",
    0x72: "#A52B26",
    0x73: "#390221",
    0x74: "#7A0027",
    0x75: "#B13837",
    0x76: "#962202",
    0x77: "#A62D07",
    0x78: "#B3462E",
    0x79: "#A24717",
    0x7a: "#C56B25",
    0x7b: "#D8721E",
    0x7c: "#003332",
    0x7d: "#00282D",
    0x7e: "#21A258",
    0x7f: "#25085A",
  };

  const defaultColors: {
    [key: string]: number;
  } = {
    "#1E1E28": 0x01,
    "#434352": 0x02,
    "#6A6C7D": 0x03,
    "#989BAA": 0x04,
    "#C9CBD4": 0x05,
    "#FFFFFF": 0x06,
    "#9A5862": 0x07,
    "#C77285": 0x08,
    "#E9A19E": 0x09,
    "#FFBEAF": 0x0a,
    "#FFE1CA": 0x0b,
    "#FFE4E4": 0x0c,
    "#C93954": 0x0d,
    "#FF4F70": 0x0e,
    "#FFA5A5": 0x0f,
    "#D35645": 0x10,
    "#FF7858": 0x11,
    "#FFB48A": 0x12,
    "#F1B400": 0x13,
    "#FFE300": 0x14,
    "#FFFF82": 0x15,
    "#008F50": 0x16,
    "#45CB52": 0x17,
    "#BDFF73": 0x18,
    "#0072E6": 0x19,
    "#0096FF": 0x1a,
    "#00C9FF": 0x1b,
    "#6E58A9": 0x1c,
    "#9476E4": 0x1d,
    "#BA93FF": 0x1e,
    "#F777B4": 0x1f,
    "#FF9EDA": 0x20,
    "#FFC4F4": 0x21,
  };

  const [side, setSide] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [layer, setLayer] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>(0);
  const [glueBrush, setGlueBrush] = useState<boolean>(false);
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<number>(0);
  const layerInputRef = useRef<null | HTMLDivElement>(null);
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>{"Block Faces"}</DialogTitle>
      <DialogContent>
        <Stack gap="2px" flexDirection="column" flexWrap="nowrap">
          {chunk &&
            chunk.faces &&
            chunk.faces[0].map((_, y) => (
              <Stack key={y} gap="2px" flexDirection="row" flexWrap="nowrap">
                {chunk.faces &&
                  chunk.faces[0].map((_, x) => {
                    if (chunk.faces) {
                      const face = new getFace(chunk.faces, layer, side, x, y);
                      const color = face.get();
                      return (
                        <ButtonBase
                          key={x}
                          onClick={() => {
                            if (chunk.faces) {
                              if (glueBrush) {
                                face.set(face.get() ^ 0x80);
                              } else {
                                if (brushColor === 0) face.set(0);
                                else face.set((face.get() & 0x80) + brushColor);
                              }
                            }
                          }}
                          sx={{
                            width: "3rem",
                            height: "3rem",
                            background:
                              (color & 0x7f) === 0x00
                                ? `linear-gradient(0deg, ${transparentBorderColor} 0%, transparent 5%, transparent 95%, ${transparentBorderColor} 100%), linear-gradient(90deg, ${transparentBorderColor} 0%, transparent 5%, transparent 95%, ${transparentBorderColor} 100%)`
                                : (!(color & 0x80)
                                    ? "radial-gradient(circle, transparent 20%, white 25%, black 35%, transparent 40%), "
                                    : "") +
                                  `linear-gradient(135deg, ${
                                    colors[color & 0x7f]
                                  } 50%, ${webColors[color & 0x7f]} 50%)`,
                          }}
                        />
                      );
                    }
                    return undefined;
                  })}
              </Stack>
            ))}
        </Stack>
        <Stack
          flexDirection="row"
          flexWrap="nowrap"
          sx={{
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          <Select
            value={side}
            onChange={(event) =>
              setSide(
                typeof event.target.value === "string"
                  ? (parseInt(event.target.value) as 0 | 1 | 2 | 3 | 4 | 5)
                  : event.target.value,
              )
            }
          >
            <MenuItem value={0}>X+</MenuItem>
            <MenuItem value={1}>X-</MenuItem>
            <MenuItem value={2}>Y+</MenuItem>
            <MenuItem value={3}>Y-</MenuItem>
            <MenuItem value={4}>Z+</MenuItem>
            <MenuItem value={5}>Z-</MenuItem>
          </Select>
          <IconButton
            onClick={() =>
              setLayer(
                (layer <= 0 ? 0 : layer - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
              )
            }
          >
            <RemoveRounded />
          </IconButton>
          <ControlledTextField
            type="number"
            label="layer"
            value={layer}
            setValue={(value) =>
              setLayer(
                parseInt((value as string | number).toString()) as
                  | 0
                  | 1
                  | 2
                  | 3
                  | 4
                  | 5
                  | 6
                  | 7,
              )
            }
            valueCheck={(event) => {
              const num = parseInt(event.target.value);
              if (num > 7) return "7";
              if (num < 0) return "0";
              if (Number.isNaN(num)) return "0";
              if (Math.floor(num) !== num) return Math.floor(num).toString();
              return event.target.value;
            }}
            ref={layerInputRef}
            sx={{
              input: {
                textAlign: "center",
              },
              maxWidth: "3.5rem",
              textAlign: "center",
            }}
          />
          <IconButton
            onClick={() =>
              setLayer(
                (layer >= 7 ? 7 : layer + 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
              )
            }
          >
            <AddRounded />
          </IconButton>
          <Stack
            sx={{
              height: "100%",
              maxHeight: "3rem",
              width: "auto",
              maxWidth: "3rem",
              aspectRatio: "1/1",
              position: "relative",
            }}
          >
            <ButtonBase
              onClick={() => {
                if (displayColorPicker) setBrushColor(0);
                setDisplayColorPicker(!displayColorPicker);
              }}
              sx={{
                aspectRatio: "1/1",
                height: "100%",
                borderRadius: "1rem",
                background:
                  brushColor === 0
                    ? ""
                    : `linear-gradient(135deg, ${colors[brushColor]} 50%, ${webColors[brushColor]} 50%)`,
                outline:
                  brushColor === 0 ? `3px solid ${transparentBorderColor}` : "",
              }}
            >
              <ClearRounded
                sx={{
                  visibility: !displayColorPicker ? "hidden" : undefined,
                  height: "2rem",
                  width: "2rem",
                }}
                htmlColor={tinycolor
                  .mostReadable(colors[brushColor], Object.keys(defaultColors))
                  .toHexString()}
              />
            </ButtonBase>
            <Stack
              sx={{
                visibility: displayColorPicker ? undefined : "hidden",
                position: "absolute",
                width: "auto",
                top: "50%",
                right: "100%",
                transform: "translate(-1rem, -50%)",
                zIndex: 2,
              }}
            >
              <GithubPicker
                triangle="hide"
                colors={Object.keys(defaultColors)}
                color={colors[brushColor].toLowerCase()}
                onChange={(value) => {
                  setBrushColor(defaultColors[value.hex.toUpperCase()]);
                  setDisplayColorPicker(false);
                }}
                styles={{
                  default: {
                    card: {
                      width: "275px",
                      height: "75px",
                      flexWrap: "wrap-reverse",
                      flexDirection: "column-reverse",
                    },
                  },
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => setGlueBrush(!glueBrush)}>
          {glueBrush ? <CenterFocusWeakRounded /> : <Brush />}
        </IconButton>
        <Stack />
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FacesDialog;
