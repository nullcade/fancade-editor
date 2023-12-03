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

function getBlockChildren(
  blockId: number,
  xSize: number,
  zSize: number
): { blockId: number; offset: [number, number, number] }[] {
  return new Array(xSize * zSize - 1).fill({}).map((_, index) => ({
    blockId: blockId + index + 1,
    offset: [Math.floor((index + 1) / zSize), 0, (index + 1) % zSize],
  }));
}

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
    blockId: Block.Ids.E_WIN_E,
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
    children: getBlockChildren(Block.Ids.E_WIN_E, 2, 2),
  },
  lose: {
    blockId: Block.Ids.E_LOSE_E,
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
    children: getBlockChildren(Block.Ids.E_LOSE_E, 2, 2),
  },
  inspectNumber: {
    blockId: Block.Ids.EF_INSPECT_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EF_INSPECT_E, 2, 2),
  },
  inspectVector: {
    blockId: Block.Ids.EV_INSPECT_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EV_INSPECT_E, 2, 2),
  },
  inspectRotation: {
    blockId: Block.Ids.EQ_INSPECT_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EQ_INSPECT_E, 2, 2),
  },
  inspectBoolean: {
    blockId: Block.Ids.ET_INSPECT_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ET_INSPECT_E, 2, 2),
  },
  inspectObject: {
    blockId: Block.Ids.EO_INSPECT_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EO_INSPECT_E, 2, 2),
  },
};
