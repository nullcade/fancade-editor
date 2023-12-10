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
      values: Value.Data[];
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
        values: Value.Data[];
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

export const FanScriptBlocks: {
  [key: string]: {
    blockId: number;
    arguments: FunctionArgument[];
    outputWires?: WireArgument["offset"][];
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
  setMass: {
    blockId: Block.Ids.EOF_SET_MASS_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOF_SET_MASS_E, 2, 2),
  },
  setFriction: {
    blockId: Block.Ids.EOF_SET_FRICTION_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOF_SET_FRICTION_E, 2, 2),
  },
  setBounciness: {
    blockId: Block.Ids.EOF_SET_BOUNCE_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOF_SET_BOUNCE_E, 2, 2),
  },
  setGravity: {
    blockId: Block.Ids.EV_SET_GRAVITY_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EV_SET_GRAVITY_E, 2, 2),
  },
  setScore: {
    blockId: Block.Ids.EFF_SET_SCORE_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFF_SET_SCORE_E, 2, 2),
  },
  setLight: {
    blockId: Block.Ids.EVQ_SET_LIT_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EVQ_SET_LIT_E, 2, 2),
  },
  addMenuItem: {
    blockId: Block.Ids.EFpO_MENU_ITEM_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Parameter,
        index: 1,
        valueType: 1,
        required: false,
      },
      {
        type: ArgumentTypes.Parameter,
        index: 2,
        valueType: 1,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFpO_MENU_ITEM_E, 2, 2),
  },
  setVisible: {
    blockId: Block.Ids.EOT_SET_VISIBLE_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOT_SET_VISIBLE_E, 2, 2),
  },
  copyObject: {
    blockId: Block.Ids.EO_CREATE_EO,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    outputWires: [[14, 1, 11]],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EO_CREATE_EO, 2, 2),
  },
  deleteObject: {
    blockId: Block.Ids.EO_DESTROY_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EO_DESTROY_E, 2, 2),
  },
};
