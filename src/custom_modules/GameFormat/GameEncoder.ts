import { Chunk, Game, Value, Vec, Wire } from ".";
import { Buffer } from "buffer";

export class GameEncoder {
  blockSize: number;
  buff: Buffer;
  off: number;
  data: Game.Data;

  constructor(data: Game.Data, blockSize = 1024) {
    this.blockSize = blockSize;
    this.buff = Buffer.allocUnsafe(this.blockSize);
    this.data = data;
    this.off = 0;
  }

  encGame(): Buffer {
    this.writeUint16LE(this.data.appVersion);
    this.writeString(this.data.title);
    this.writeString(this.data.author);
    this.writeString(this.data.description);
    this.writeUint16LE(this.data.idOffset);
    this.writeUint16LE(this.data.chunks.length);
    this.data._rawChunks.forEach(this.writeChunk.bind(this));

    return this.buff.subarray(0, this.off);
  }

  writeChunk(chunk: Chunk.Data): void {
    const isMulti = chunk.parent && chunk.offset;
    const flags = [
      chunk.wires && chunk.wires.length > 0,
      chunk.values && chunk.values.length > 0,
      chunk.blocks && chunk.blocks.length > 0,
      chunk.faces && chunk.faces.length > 0,
      isMulti,
      chunk.collider !== undefined,
      chunk.locked,
      false,
      chunk.color !== undefined,
      false,
      false,
      chunk.name !== undefined,
      chunk.type !== Chunk.Type.Rigid,
    ].map((v) => (v ? 1 : 0));
    this.writeBin(flags);
    if (chunk.type !== Chunk.Type.Rigid) this.writeUint8(chunk.type);
    if (chunk.name !== undefined) this.writeString(chunk.name);
    if (chunk.collider !== undefined) this.writeUint8(chunk.collider);
    if (isMulti && chunk.parent) this.writeUint16LE(chunk.parent);
    if (isMulti && chunk.offset) this.writeOff(chunk.offset);
    if (chunk.color !== undefined) this.writeUint8(chunk.color);
    if (chunk.faces !== undefined) this.writeFaces(chunk.faces);
    if (chunk.blocks && chunk.blocks.length > 0) this.writeBlocks(chunk.blocks);
    if (chunk.values && chunk.values.length > 0) this.writeUint16LE(chunk.values.length);
    if (chunk.values && chunk.values.length > 0)
      chunk.values.forEach(this.writeValue.bind(this));
    if (chunk.wires && chunk.wires.length > 0) this.writeUint16LE(chunk.wires.length);
    if (chunk.wires && chunk.wires.length > 0)
      chunk.wires.forEach(this.writeWire.bind(this));
  }
  writeFaces(faces: Chunk.Faces) {
    faces.flat(4).forEach(this.writeUint8.bind(this));
  }
  writeBlocks(blocks: Chunk.Blocks): void {
    this.writePos([blocks[0][0].length, blocks[0].length, blocks.length]);
    blocks.flat(3).forEach(this.writeUint16LE.bind(this));
  }
  writeValue(value: Value.Data): void {
    this.writeUint8(value.index);
    this.writeUint8(value.type);
    this.writePos(value.position);
    const cbs: Record<number, (this: this, value: any) => void> = {
      [Value.Type.Int]: this.writeUint8,
      [Value.Type.Long]: this.writeUint16LE,
      [Value.Type.Float]: this.writeFloatLE,
      [Value.Type.Vec]: this.writeVec,
    };
    (cbs[value.type] ?? this.writeString).apply(this, [value.value]);
  }
  writeWire(wire: Wire.Data): void {
    wire.position.map(this.writePos.bind(this));
    wire.offset.map(this.writePos.bind(this));
  }

  alloc(size = 1): Buffer {
    if (this.off + size > this.buff.length) {
      const prev = this.buff;
      this.buff = Buffer.allocUnsafe(this.off + this.blockSize);
      prev.copy(this.buff);
    }
    return this.buff.subarray(this.off, (this.off += size));
  }
  writeUint8(value: number): number {
    return this.alloc(1).writeUint8(value);
  }
  writeUint16LE(value: number): number {
    return this.alloc(2).writeUint16LE(value);
  }
  writeFloatLE(value: number): number {
    return this.alloc(4).writeFloatLE(value);
  }
  writeOff(value: Vec): number {
    const buff = this.alloc(value.length);
    value.map((v, i) => void buff.writeUint8(v, i));
    return this.off;
  }
  writePos(value: Vec): number {
    const buff = this.alloc(value.length * 2);
    value.map((v, i) => void buff.writeUInt16LE(v, i * 2));
    return this.off;
  }
  writeVec(value: Vec): number {
    const buff = this.alloc(value.length * 4);
    value.map((v, i) => void buff.writeFloatLE(v, i * 4));
    return this.off;
  }
  writeString(value: string): number {
    const buff = this.alloc(value.length + 1);
    buff.writeUint8(value.length);
    return buff.write(value, 1, "utf-8");
  }
  writeBin(value: (0 | 1)[]): number {
    const len = Math.ceil(value.length / 8);
    const buff = this.alloc(len);
    for (let i = 0; i < len; i++)
      buff.writeUint8(
        value
          .slice(i << 3, (i + 1) << 3)
          .reduce<number>((pre, cur, b) => pre + (cur << b), 0),
        i,
      );
    return this.off;
  }
}

// export const encodeGame = (new GameEncoder()).encGame;
