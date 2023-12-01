import { Block, Value } from "custom_modules/GameFormat";

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type ParameterId = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3;

export namespace FanScript {
  export interface Result {
    originalScript: string;
    blocks: {
      id: Block.Id;
      name: string;
      wires: {
        position: [[number, number, number], [number, number, number]];
        offset: [[number, number, number], [number, number, number]];
      }[];
    }[];
    newBlocks: {
      id: Block.Id;
      name: string;
      pins: RequireOnlyOne<
        {
          execute: 0 | 1;
          parameter: { id: ParameterId; type: number; name: string };
        },
        "execute" | "parameter"
      >[];
      blocks: {
        id: Block.Id;
        name: string;
        wires: {
          position: [[number, number, number], [number, number, number]];
          offset: [[number, number, number], [number, number, number]];
        }[];
      }[];
    }[];
  }
}

export enum ArgumentTypes {
  Wire = "wire",
  Parameter = "parameter",
}
type WireArgument = {
  type: ArgumentTypes.Wire;
  offset: [number, number, number];
};
type ParameterArgument = {
  type: ArgumentTypes.Parameter;
  index: number;
  valueType: Value.Type;
  required: boolean;
};
export type FunctionArgument = WireArgument | ParameterArgument;

export const FanScriptFunctions: {
  [key: string]: {
    blockId: number;
    arguments: FunctionArgument[];
    beforeOffset: [number, number, number];
    afterOffset: [number, number, number];
    children: {
      blockId: number;
      offset: [number, number, number];
    }[];
  };
} = {
  win: {
    blockId: 252,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: [
      { blockId: 253, offset: [0, 0, 1] },
      { blockId: 254, offset: [1, 0, 0] },
      { blockId: 255, offset: [1, 0, 1] },
    ],
  },
  lose: {
    blockId: 256,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: [
      { blockId: 257, offset: [0, 0, 1] },
      { blockId: 258, offset: [1, 0, 0] },
      { blockId: 259, offset: [1, 0, 1] },
    ],
  },
};
