import { Chunk, Fill, Game, Grid, Multiply, Value, Vec, Wire } from ".";
import { Buffer } from "buffer";
import { nanoid } from "nanoid";

export class GameDecoder {
  buff: Buffer;
  off: number;
  chunksMap: Map<number, Chunk.Data>;
  uuidMap: Map<number, String>;
  idOffset: number;

  constructor(buff: Buffer) {
    this.buff = buff;
    this.off = 0;
    this.chunksMap = new Map<number, Chunk.Data>();
    this.uuidMap = new Map<number, String>();
    this.idOffset = 0;
  }

  decGame(): Game.Data {
    const appVersion = this.readUint16LE();
    const title = this.readString();
    const author = this.readString();
    const description = this.readString();
    this.idOffset = this.readUint16LE();
    const chunksLen = this.readUint16LE();
    const chunks = Array.from({ length: chunksLen }, this.readChunk.bind(this));
    chunks.forEach(chunk => {
      chunk.blocks.forEach((x, xIndex) => x.forEach((y, yIndex) => y.forEach((block, zIndex) => {
        if(typeof block === "number" && block >= this.idOffset)
          chunk.blocks[xIndex][yIndex][zIndex] = this.uuidMap.get(block) ?? 0;
      })));
      if (chunk.name || !chunk.parent) return;
      this.chunksMap.get(chunk.parent)?.children?.push({
        uuid: chunk.uuid,
        offset: chunk.offset,
        faces: chunk.faces,
        blocks: chunk.blocks,
        values: chunk.values,
        wires: chunk.wires,
      });
    });

    return {
      appVersion,
      title,
      author,
      description,
      idOffset: this.idOffset,
      chunks: [...this.chunksMap.values()]
    };
  }

  readChunk(_: never, index: number): Chunk.Data {
    const flags = this.readBin(2);
    const [
      hasWires,
      hasValues,
      hasBlocks,
      hasFaces,
      isMulti,
      hasCollider,
      isLocked,
      ,
      hasColor,
      ,
      ,
      hasName,
      hasType,
    ] = flags;
    const type = hasType ? (this.readUint8() as Chunk.Type) : 0;
    const name = hasName ? this.readString() : undefined;
    const collider = hasCollider
      ? (this.readUint8() as Chunk.Collider)
      : undefined;
    const parent = isMulti ? this.readUint16LE() : undefined;
    const offset = isMulti ? this.readOff() : undefined;
    const color = hasColor ? this.readUint8() : undefined;
    const faces = hasFaces ? this.readFaces() : undefined;
    const blocks = hasBlocks ? this.readBlocks() : [];
    const values = hasValues
      ? Array.from({ length: this.readUint16LE() }, this.readValue.bind(this))
      : [];
    const wires = hasWires
      ? Array.from({ length: this.readUint16LE() }, this.readWire.bind(this))
      : [];
    const children: Chunk.Data["children"] = parent ? [] : undefined;
    const uuid = nanoid();
    this.uuidMap.set(index + this.idOffset, uuid);
    const chunk: Chunk.Data = {
      uuid,
      type,
      name,
      parent,
      offset,
      locked: !!isLocked,
      collider,
      color,
      faces,
      blocks,
      values,
      wires,
      children,
    }
    if (parent === index + this.idOffset || !parent) this.chunksMap.set(index + this.idOffset, chunk);

    return chunk;
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
