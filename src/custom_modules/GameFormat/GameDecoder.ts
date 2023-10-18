import { Chunk, Fill, Game, Grid, Multiply, Value, Vec, Wire } from ".";
import { Buffer } from "buffer";

export class GameDecoder {
  buff: Buffer;
  off: number;
  chunks: Map<number, Chunk.Data>;
  lastId?: number;

  constructor(buff: Buffer) {
    this.buff = buff;
    this.off = 0;
    this.chunks = new Map<number, Chunk.Data>();
  }

  decGame(): Game.Data {
    console.log(this.buff)
    const appVersion = this.readUint16LE();
    const title = this.readString();
    const author = this.readString();
    const description = this.readString();
    const idOffset = this.readUint16LE();
    const chunksLen = this.readUint16LE();
    for (let i = 0; i < chunksLen; i++) this.readChunk(idOffset - 1);
    console.log(chunksLen, this.chunks);
    const chunks = Array.from(this.chunks.values())

    return { appVersion, title, author, description, idOffset, chunks };
  }

  readChunk(idOffset: number): void {
    const [
      hasWires,
      hasValues,
      hasBlocks,
      hasFaces,
      isMulti,
      hasCollider,
      isLocked,
      unknownFlagA,
      hasColor,
      unknownFlagB,
      unknownFlagC,
      hasName,
      hasType,
    ] = this.readBin(2);
    const flags = {
      hasWires,
      hasValues,
      hasBlocks,
      hasFaces,
      isMulti,
      hasCollider,
      isLocked,
      unknownFlagA,
      hasColor,
      unknownFlagB,
      unknownFlagC,
      hasName,
      hasType
    };
    const type = hasType ? (this.readUint8() as Chunk.Type) : 0;
    const name = hasName ? this.readString() : undefined;
    const collider = hasCollider
      ? (this.readUint8() as Chunk.Collider)
      : undefined;
    const id = isMulti ? this.readUint16LE() : (this.lastId ?? idOffset) + 1;
    this.lastId = id;
    const offset = isMulti ? this.readOff() : [0, 0, 0] as Vec;
    const color = hasColor ? this.readUint8() : undefined;
    const faces = hasFaces ? this.readFaces() : undefined;
    const blocks = hasBlocks ? this.readBlocks() : [];
    const values = hasValues
      ? Array.from({ length: this.readUint16LE() }, this.readValue.bind(this))
      : [];
    const wires = hasWires
      ? Array.from({ length: this.readUint16LE() }, this.readWire.bind(this))
      : [];
    if (name) {
      this.chunks.set(id, {
        type,
        name,
        id,
        locked: !!isLocked,
        collider,
        blocks,
        values,
        wires,
        faces,
        color,
        offset,
        children: this.chunks.get(id)?.children,
        flags
      })
    } else {
      this.chunks.set(id, {
        ...this.chunks.get(id) ?? {
          type: 0,
          name: '',
          id,
          locked: false,
          collider: 0,
          color: 0,
          offset: [0, 0, 0],
          blocks: [],
          values: [],
          wires: [],
          faces: [],
          flags
        },
        children: (this.chunks.get(id)?.children ?? []).concat([{
          offset: offset,
          blocks,
          values,
          wires,
          faces,
          flags
        }])
      })
    }
  }
  readFaces(): Chunk.Faces {
    return this.readGrid([6, 8, 8, 8], this.readUint8);
  }
  readBlocks(): Chunk.Blocks {
    return this.readGrid(this.readPos().reverse() as Vec, this.readUint16LE);
  }
  readValue(): Value.Data {
    const index = this.readUint8();
    const type = this.readUint8() as Value.Type;
    const position = this.readPos();
    const cbs: Partial<Record<number, (this: this) => Value.Value>> = {
      [Value.Type.Int]: this.readUint8,
      [Value.Type.Long]: this.readUint16LE,
      [Value.Type.Float]: this.readFloatLE,
      [Value.Type.Vec]: this.readVec,
    };
    const value = (cbs[type] ?? this.readString).apply(this);
    return { position, index, type, value };
  }
  readWire(): Wire.Data {
    const position = [this.readPos(), this.readPos()] as const;
    const offset = [this.readPos(), this.readPos()] as const;
    return { position, offset };
  }

  read(size = 1) {
    return this.buff.subarray(this.off, (this.off += size));
  }
  readUint8(): number {
    return this.read().readUint8();
  }
  readUint16LE(): number {
    return this.read(2).readUint16LE();
  }
  readFloatLE(): number {
    return this.read(4).readFloatLE();
  }
  readOff(): Vec {
    return [this.readUint8(), this.readUint8(), this.readUint8()];
  }
  readPos(): Vec {
    return [this.readUint16LE(), this.readUint16LE(), this.readUint16LE()];
  }
  readVec(): Vec {
    return [this.readFloatLE(), this.readFloatLE(), this.readFloatLE()];
  }
  readString(): string {
    const len = this.readUint8();
    return this.read(len).toString("utf-8");
  }
  readBin(): Fill<8, 0 | 1>;
  readBin<L extends number>(size: L): Fill<Multiply<L, 8>, 0 | 1>;
  readBin(size = 1) {
    const buff = this.read(size);
    return Array.from(
      { length: size * 8 },
      (_v, i) => (buff[Math.floor(i / 8)] >> i % 8) & 1,
    );
  }
  readGrid<D extends readonly number[], T>(
    dims: readonly [...D],
    f: (this: this) => T,
  ): Grid<D, T> {
    if (dims.length > 0)
      return Array.from({ length: dims[0] }, () =>
        this.readGrid(dims.slice(1), f),
      ) as any;
    else return f.apply(this) as any;
  }
}

// export const decodeGame = new GameDecoder().decGame;
