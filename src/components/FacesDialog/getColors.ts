import { Chunk } from "custom_modules/GameFormat";

export default function getColors(
  faces: Chunk.Faces,
  layer: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
  side: 0 | 1 | 2 | 3 | 4 | 5,
  x: number,
  y: number
) {
  if (side === 0) 
    return faces[side]
        [layer][(faces[0].length - 1) - y][x];
  if (side === 1) 
    return faces[side]
        [(faces[0].length - 1) - layer][(faces[0].length - 1) - y][(faces[0].length - 1) - x];
  if (side === 2) 
    return faces[side]
        [x][layer][(faces[0].length - 1) - y];
  if (side === 3) 
    return faces[side]
        [x][(faces[0].length - 1)-layer][y];
  if (side === 4) 
    return faces[side]
        [(faces[0].length - 1)-x][(faces[0].length - 1)-y][layer];
  if (side === 5) 
    return faces[side]
        [x][(faces[0].length - 1) - y][(faces[0].length - 1)-layer];
  return 0;
}
