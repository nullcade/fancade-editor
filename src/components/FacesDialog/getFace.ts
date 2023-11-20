import { Chunk } from "custom_modules/GameFormat";

export class getFace {
  side: 0 | 1 | 2 | 3 | 4 | 5;
  x: number;
  y: number;
  z: number;
  zArray: number[];
  constructor(
    faces: Chunk.Faces,
    layer: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    side: 0 | 1 | 2 | 3 | 4 | 5,
    x: number,
    y: number
  ) {
    this.side = side;
    if (side === 0) {
      this.x = layer;
      this.y = faces[0].length - 1 - y;
      this.z = x;
    } else if (side === 1) {
      this.x = faces[0].length - 1 - layer;
      this.y = faces[0].length - 1 - y;
      this.z = faces[0].length - 1 - x;
    } else if (side === 2) {
      this.x = x;
      this.y = layer;
      this.z = faces[0].length - 1 - y;
    } else if (side === 3) {
      this.x = x;
      this.y = faces[0].length - 1 - layer;
      this.z = y;
    } else if (side === 4) {
      this.x = faces[0].length - 1 - x;
      this.y = faces[0].length - 1 - y;
      this.z = layer;
    } else if (side === 5) {
      this.x = x;
      this.y = faces[0].length - 1 - y;
      this.z = faces[0].length - 1 - layer;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    this.zArray = faces[this.side][this.x][this.y];
  }
  get() {
    return this.zArray[this.z];
  }
  set(value: number) {
    this.zArray[this.z] = value;
  }
}

export default getFace;
