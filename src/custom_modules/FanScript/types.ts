import { Block, Value } from "custom_modules/GameFormat";
import ts from "typescript";

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
  export interface ExecuteWire {
    blockY: number;
    offset: [number, number, number];
  }
  export type ExecuteStack = ExecuteWire[];
  export interface WireVariable {
    blockY: number;
    offset: [number, number, number];
    splits: number;
    source?: {
      function: string;
      name: string;
    };
  }
  export type Variable = number | string | boolean | WireVariable;
  export interface VariableStack {
    [key: string]: Variable;
  }
  export interface FunctionStack {
    [key: string]: {
      body: ts.Block;
      parameters: string[];
      wiresStart: number;
    };
  }
  export interface Result {
    originalScript: string;
    scriptName: string;
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
  export const scriptTypes = [
    "string",
    "number",
    "boolean",
    "NumWire",
    "VecWire",
    "BoolWire",
    "RotWire",
    "ObjWire",
    "ConWire",
    "NumPointer",
    "VecPointer",
    "BoolPointer",
    "RotPointer",
    "ObjPointer",
    "ConPointer",
  ];
}

export const SelectableParameters: {
  [key: string]: {
    [key: string]: number;
  };
} = {
  Blocks: {
    EMPTY: 0x00,
    STONE_BLOCK: 0x01,
    BRICKS: 0x02,
    GRASS_A: 0x03,
    GRASS_B: 0x04,
    DIRT: 0x05,
    WOOD_X: 0x06,
    WOOD_Y: 0x07,
    WOOD_Z: 0x08,
    FOLDER_UNKNOWN: 0x17e,
    SWIPE_CHICK: 0x17f,
    DIRT_SLAB: 0x180,
    STEEL: 0x181,
    ARCH: 0x182,
    BOX: 0x184,
    GOAL: 0x185,
    BUTTON: 0x186,
    FOLDER_EMPTY: 0x19f,
    FOLDER_LOCKED: 0x1a0,
    PHYSICS_BOX: 0x1a9,
    BALL: 0x1aa,
    TILT_BALL: 0x1ab,
    PASS_THROUGH: 0x1c0,
    DIRT_B: 0x1ed,
    FLOWERS: 0x1ee,
    FOLIAGE: 0x1ef,
    FOLIAGE_B: 0x1f0,
    FOLIAGE_TOP: 0x1f1,
    FOLIAGE_BOT: 0x1f2,
    FOLIAGE_SLAB: 0x1f3,
    SHRUB: 0x1f4,
    STONE: 0x1f5,
    STONE_B: 0x1f6,
    STONE_TOP: 0x1f7,
    STONE_BOT: 0x1f8,
    STONE_SLAB: 0x1f9,
    STONE_PILLAR: 0x1fa,
    STONE_LOWER: 0x1fb,
    WOOD_LOWER_X: 0x1fc,
    WOOD_LOWER_Y: 0x1fd,
    WOOD_UPPER_X: 0x1fe,
    WOOD_UPPER_Y: 0x1ff,
    STICK_X: 0x200,
    STICK_Y: 0x201,
    STICK_Z: 0x202,
    STICK_NE: 0x203,
    STICK_NW: 0x204,
    STICK_SW: 0x205,
    STICK_SE: 0x206,
    STICK_UE: 0x207,
    STICK_UN: 0x208,
    STICK_UW: 0x209,
    STICK_US: 0x20a,
    STICK_DE: 0x20b,
    STICK_DN: 0x20c,
    STICK_DW: 0x20d,
    STICK_DS: 0x20e,
    WHEEL: 0x216,
    DASH_CAT: 0x217,
    MARKER: 0x218,
    DINO: 0x219,
    DINO_RED: 0x21a,
    BUTTERFLY: 0x21b,
    SCRIPT: 0x221,
    SPHERE: 0x222,
    SLATE: 0x223,
    SLATE_B: 0x224,
    SLATE_NE: 0x225,
    SLATE_NW: 0x226,
    SLATE_SE: 0x227,
    SLATE_SW: 0x228,
    SLATE_TOP: 0x229,
    SLATE_BOT: 0x22a,
    PARTICLE: 0x22b,
  },
  Price: {
    TenFixed: 0,
    TenLinear: 2,
    TenDouble: 3,
    HundredFixed: 4,
    HundredLinear: 5,
    HundredDouble: 6,
    ThousandFixed: 7,
    ThousandLinear: 8,
    ThousandDouble: 9,
    TenThousandFixed: 10,
  },
  LeaderboardOrder: {
    MostPoints: 0,
    FewestPoints: 2,
    FastestTime: 3,
    LongestTime: 4,
  },
  Sound: {
    Chirp: 0,
    Scrape: 1,
    Squeek: 2,
    Engine: 3,
    Button: 4,
    Ball: 5,
    Piano: 6,
    Marimba: 7,
    Pad: 8,
    Beep: 9,
    Plop: 10,
    Flop: 11,
    Splash: 12,
    Boom: 13,
    Hit: 14,
    Clang: 15,
    Jump: 16,
  },
  Touching: {
    Touching: 0,
    Begins: 1,
    Ends: 2,
  },
  Count: {
    First: 0,
    Second: 1,
    Third: 2,
  },
  JoystickMode: {
    XY: 0,
    Screen: 1,
  },
};

export enum ArgumentTypes {
  Wire = "wire",
  Parameter = "parameter",
}
type WireArgument = {
  type: ArgumentTypes.Wire;
  offset: [number, number, number];
  callback?: true;
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
  zSize: number,
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
    beforeOffset?: [number, number, number];
    afterOffset?: [number, number, number];
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
  setCamera: {
    blockId: Block.Ids.EVQF_SET_CAM_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EVQF_SET_CAM_E, 3, 2),
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
  getScreenSize: {
    blockId: Block.Ids.SCREEN_SIZE_FF,
    arguments: [],
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.SCREEN_SIZE_FF, 2, 2),
  },
  getAccelerometer: {
    blockId: Block.Ids.ACCELEROMETER_V,
    arguments: [],
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.ACCELEROMETER_V, 2, 2),
  },
  getFrame: {
    blockId: Block.Ids.FRAME_F,
    arguments: [],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.FRAME_F, 1, 2),
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

  getPosition: {
    blockId: Block.Ids.O_GET_POS_VQ,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.O_GET_POS_VQ, 2, 2),
  },
  setPosition: {
    blockId: Block.Ids.EOVQ_SET_POS_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOVQ_SET_POS_E, 3, 2),
  },
  addRaycast: {
    blockId: Block.Ids.VV_RAYCAST_TVO,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    outputWires: [
      [14, 1, 19],
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.VV_RAYCAST_TVO, 3, 2),
  },
  getSize: {
    blockId: Block.Ids.O_GET_SIZE_VV,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.O_GET_SIZE_VV, 2, 2),
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

  playSound: {
    blockId: Block.Ids.EFF_SFX_PLAY_FE,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
      {
        type: ArgumentTypes.Parameter,
        index: 1,
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
    outputWires: [[14, 1, 11]],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFF_SFX_PLAY_FE, 2, 2),
  },
  stopSound: {
    blockId: Block.Ids.EF_SFX_STOP_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EF_SFX_STOP_E, 2, 2),
  },
  setVolumePitch: {
    blockId: Block.Ids.EFFF_VOLUME_PITCH_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFFF_VOLUME_PITCH_E, 3, 2),
  },

  addForce: {
    blockId: Block.Ids.EOVVV_ADD_FORCE_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 27],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 30],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOVVV_ADD_FORCE_E, 4, 2),
  },
  getVelocity: {
    blockId: Block.Ids.O_GET_VEL_VV,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.O_GET_VEL_VV, 2, 2),
  },
  setVelocity: {
    blockId: Block.Ids.EOVV_SET_VEL_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOVV_SET_VEL_E, 3, 2),
  },
  setLocked: {
    blockId: Block.Ids.EOVV_SET_LOCKED_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOVV_SET_LOCKED_E, 3, 2),
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
  addConstraint: {
    blockId: Block.Ids.EOOV_ADD_CONSTRAINT_EC,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    outputWires: [[14, 1, 19]],
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EOOV_ADD_CONSTRAINT_EC, 3, 2),
  },
  setLinearLimits: {
    blockId: Block.Ids.ECVV_SET_LIN_LIMITS_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ECVV_SET_LIN_LIMITS_E, 3, 2),
  },
  setAngularLimits: {
    blockId: Block.Ids.ECVV_SET_ANG_LIMITS_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ECVV_SET_ANG_LIMITS_E, 3, 2),
  },
  setLinearSpring: {
    blockId: Block.Ids.ECVV_SET_LIN_SPRING_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ECVV_SET_LIN_SPRING_E, 3, 2),
  },
  setAngularSpring: {
    blockId: Block.Ids.ECVV_SET_ANG_SPRING_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ECVV_SET_ANG_SPRING_E, 3, 2),
  },
  setLinearMotor: {
    blockId: Block.Ids.ECVV_SET_LIN_MOTOR_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ECVV_SET_LIN_MOTOR_E, 3, 2),
  },
  setAngularMotor: {
    blockId: Block.Ids.ECVV_SET_ANG_MOTOR_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ECVV_SET_ANG_MOTOR_E, 3, 2),
  },

  if: {
    blockId: Block.Ids.ET_IF_EEE,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [14, 1, 11],
        callback: true,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [14, 1, 3],
        callback: true,
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ET_IF_EEE, 2, 2),
  },
  onPlay: {
    blockId: Block.Ids.E_PLAY_EE,
    arguments: [
      { type: ArgumentTypes.Wire, offset: [14, 1, 11], callback: true },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_PLAY_EE, 2, 2),
  },
  onUpdate: {
    blockId: Block.Ids.E_LATE_UPDATE_EE,
    arguments: [
      { type: ArgumentTypes.Wire, offset: [14, 1, 11], callback: true },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_LATE_UPDATE_EE, 2, 2),
  },
  onBoxart: {
    blockId: Block.Ids.E_SCREENSHOT_EE,
    arguments: [
      { type: ArgumentTypes.Wire, offset: [14, 1, 11], callback: true },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_SCREENSHOT_EE, 2, 2),
  },
  onTouch: {
    blockId: Block.Ids.E_TOUCH_EFFE,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
      {
        type: ArgumentTypes.Parameter,
        index: 1,
        valueType: 1,
        required: false,
      },
      { type: ArgumentTypes.Wire, offset: [14, 1, 19], callback: true },
    ],
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    beforeOffset: [3, 1, 22],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_TOUCH_EFFE, 3, 2),
  },
  onSwipe: {
    blockId: Block.Ids.E_SWIPE_EVE,
    arguments: [
      { type: ArgumentTypes.Wire, offset: [14, 1, 11], callback: true },
    ],
    outputWires: [[14, 1, 3]],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_SWIPE_EVE, 2, 2),
  },
  addButton: {
    blockId: Block.Ids.E_BUT_SENSOR_EE,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
      { type: ArgumentTypes.Wire, offset: [14, 1, 11], callback: true },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_BUT_SENSOR_EE, 2, 2),
  },
  addJoystick: {
    blockId: Block.Ids.E_JOY_SENSOR_VE,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 1,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.E_JOY_SENSOR_VE, 2, 2),
  },
  onCollision: {
    blockId: Block.Ids.EO_COLLISION_EOFVE,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 27],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [14, 1, 27],
        callback: true,
      },
    ],
    outputWires: [
      [14, 1, 19],
      [14, 1, 11],
      [14, 1, 3],
    ],
    beforeOffset: [3, 1, 30],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EO_COLLISION_EOFVE, 4, 2),
  },
  loop: {
    blockId: Block.Ids.EFF_LOOP_EFE,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [14, 1, 11],
        callback: true,
      },
    ],
    outputWires: [[14, 1, 3]],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFF_LOOP_EFE, 2, 2),
  },

  negate: {
    blockId: Block.Ids.F_NEG_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_NEG_F, 1, 2),
  },
  inverse: {
    blockId: Block.Ids.Q_INV_Q,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.Q_INV_Q, 1, 2),
  },
  addNumbers: {
    blockId: Block.Ids.FF_ADD_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_ADD_F, 2, 2),
  },
  addVectors: {
    blockId: Block.Ids.VV_ADD_V,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_ADD_V, 2, 2),
  },
  subtractNumbers: {
    blockId: Block.Ids.FF_SUB_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_SUB_F, 2, 2),
  },
  subtractVectors: {
    blockId: Block.Ids.VV_SUB_V,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_SUB_V, 2, 2),
  },
  multiply: {
    blockId: Block.Ids.FF_MUL_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_MUL_F, 2, 2),
  },
  scale: {
    blockId: Block.Ids.VF_MUL_V,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VF_MUL_V, 2, 2),
  },
  rotate: {
    blockId: Block.Ids.VQ_MUL_V,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VQ_MUL_V, 2, 2),
  },
  combine: {
    blockId: Block.Ids.QQ_MUL_Q,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.QQ_MUL_Q, 2, 2),
  },
  divide: {
    blockId: Block.Ids.FF_DIV_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_DIV_F, 2, 2),
  },
  power: {
    blockId: Block.Ids.FF_POW_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_POW_F, 2, 2),
  },
  equalNumbers: {
    blockId: Block.Ids.FF_EQL_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_EQL_T, 2, 2),
  },
  equalVector: {
    blockId: Block.Ids.VV_EQL_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_EQL_T, 2, 2),
  },
  equalObjects: {
    blockId: Block.Ids.OO_EQL_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.OO_EQL_T, 2, 2),
  },
  equalBoolean: {
    blockId: Block.Ids.TT_EQL_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.TT_EQL_T, 2, 2),
  },
  lessThan: {
    blockId: Block.Ids.FF_LT_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_LT_T, 2, 2),
  },
  greaterThan: {
    blockId: Block.Ids.FF_GT_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_GT_T, 2, 2),
  },
  and: {
    blockId: Block.Ids.TT_AND_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.TT_AND_T, 2, 2),
  },
  or: {
    blockId: Block.Ids.TT_OR_T,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.TT_OR_T, 2, 2),
  },
  not: {
    blockId: Block.Ids.T_NOT_T,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.T_NOT_T, 1, 2),
  },
  random: {
    blockId: Block.Ids.FF_RANDOM_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_RANDOM_F, 2, 2),
  },
  setRandomSeed: {
    blockId: Block.Ids.EF_RANDOM_SEED_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    beforeOffset: [3, 1, 14],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EF_RANDOM_SEED_E, 2, 2),
  },
  min: {
    blockId: Block.Ids.FF_MIN_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_MIN_F, 2, 2),
  },
  max: {
    blockId: Block.Ids.FF_MAX_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_MAX_F, 2, 2),
  },
  sin: {
    blockId: Block.Ids.F_SIN_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_SIN_F, 1, 2),
  },
  cos: {
    blockId: Block.Ids.F_COS_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_COS_F, 1, 2),
  },
  round: {
    blockId: Block.Ids.F_ROUND_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_ROUND_F, 1, 2),
  },
  floor: {
    blockId: Block.Ids.F_FLOOR_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_FLOOR_F, 1, 2),
  },
  ceil: {
    blockId: Block.Ids.F_CEIL_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_CEIL_F, 1, 2),
  },
  abs: {
    blockId: Block.Ids.F_ABS_F,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.F_ABS_F, 1, 2),
  },
  mod: {
    blockId: Block.Ids.FF_MOD_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_MOD_F, 2, 2),
  },
  log: {
    blockId: Block.Ids.FF_LOG_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FF_LOG_F, 2, 2),
  },
  breakVector: {
    blockId: Block.Ids.V_SPLIT_FFF,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
      },
    ],
    outputWires: [
      [14, 1, 19],
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.V_SPLIT_FFF, 3, 2),
  },
  makeVector: {
    blockId: Block.Ids.FFF_JOIN_V,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    outputWires: [[14, 1, 19]],
    children: getBlockChildren(Block.Ids.FFF_JOIN_V, 3, 2),
  },
  normalize: {
    blockId: Block.Ids.V_NORMALIZE_V,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.V_NORMALIZE_V, 1, 2),
  },
  dotProduct: {
    blockId: Block.Ids.VV_DOT_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_DOT_F, 2, 2),
  },
  crossProduct: {
    blockId: Block.Ids.VV_CROSS_V,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_CROSS_V, 2, 2),
  },
  breakRotation: {
    blockId: Block.Ids.Q_EULER_FFF,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
      },
    ],
    outputWires: [
      [14, 1, 19],
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.Q_EULER_FFF, 3, 2),
  },
  makeRotation: {
    blockId: Block.Ids.FFF_EULER_Q,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    outputWires: [[14, 1, 19]],
    children: getBlockChildren(Block.Ids.FFF_EULER_Q, 3, 2),
  },
  distance: {
    blockId: Block.Ids.VV_DIST_F,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_DIST_F, 2, 2),
  },
  lerp: {
    blockId: Block.Ids.QQF_LERP_Q,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    outputWires: [[14, 1, 19]],
    children: getBlockChildren(Block.Ids.QQF_LERP_Q, 3, 2),
  },
  axisAngle: {
    blockId: Block.Ids.VF_AXIS_ANG_Q,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VF_AXIS_ANG_Q, 2, 2),
  },
  screenToWorld: {
    blockId: Block.Ids.FF_S2W_VV,
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
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.FF_S2W_VV, 2, 2),
  },
  worldToScreen: {
    blockId: Block.Ids.V_W2S_FF,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 11],
      },
    ],
    outputWires: [
      [14, 1, 11],
      [14, 1, 3],
    ],
    children: getBlockChildren(Block.Ids.V_W2S_FF, 2, 2),
  },
  lineVsPlane: {
    blockId: Block.Ids.VVVV_LINE_VS_PLANE_V,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 27],
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 19],
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
    outputWires: [[14, 1, 27]],
    children: getBlockChildren(Block.Ids.VVVV_LINE_VS_PLANE_V, 4, 2),
  },
  lookRotation: {
    blockId: Block.Ids.VV_LOOK_ROT_Q,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VV_LOOK_ROT_Q, 2, 2),
  },

  getNumber: {
    blockId: Block.Ids.VAR_Fp,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.VAR_Fp, 1, 2),
  },
  getObject: {
    blockId: Block.Ids.VAR_Op,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.VAR_Op, 1, 2),
  },
  getVector: {
    blockId: Block.Ids.VAR_Vp,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.VAR_Vp, 1, 2),
  },
  getRotation: {
    blockId: Block.Ids.VAR_Qp,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.VAR_Qp, 1, 2),
  },
  getBoolean: {
    blockId: Block.Ids.VAR_Tp,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.VAR_Tp, 1, 2),
  },
  getConstraint: {
    blockId: Block.Ids.VAR_Cp,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.VAR_Cp, 1, 2),
  },
  setNumber: {
    blockId: Block.Ids.EF_SET_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EF_SET_VAR_E, 1, 2),
  },
  setObject: {
    blockId: Block.Ids.EO_SET_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EO_SET_VAR_E, 1, 2),
  },
  setVector: {
    blockId: Block.Ids.EV_SET_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EV_SET_VAR_E, 1, 2),
  },
  setRotation: {
    blockId: Block.Ids.EQ_SET_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EQ_SET_VAR_E, 1, 2),
  },
  setBoolean: {
    blockId: Block.Ids.ET_SET_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.ET_SET_VAR_E, 1, 2),
  },
  setConstraint: {
    blockId: Block.Ids.EC_SET_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 6,
        required: false,
      },
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EC_SET_VAR_E, 1, 2),
  },
  setNumberPointer: {
    blockId: Block.Ids.EFpF_SET_VAR_E,
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
    children: getBlockChildren(Block.Ids.EFpF_SET_VAR_E, 2, 2),
  },
  setObjectPointer: {
    blockId: Block.Ids.EOpO_SET_VAR_E,
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
    children: getBlockChildren(Block.Ids.EOpO_SET_VAR_E, 2, 2),
  },
  setVectorPointer: {
    blockId: Block.Ids.EVpV_SET_VAR_E,
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
    children: getBlockChildren(Block.Ids.EVpV_SET_VAR_E, 2, 2),
  },
  setRotationPointer: {
    blockId: Block.Ids.EQpQ_SET_VAR_E,
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
    children: getBlockChildren(Block.Ids.EQpQ_SET_VAR_E, 2, 2),
  },
  setBooleanPointer: {
    blockId: Block.Ids.ETpT_SET_VAR_E,
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
    children: getBlockChildren(Block.Ids.ETpT_SET_VAR_E, 2, 2),
  },
  setConstraintPointer: {
    blockId: Block.Ids.ECpC_SET_VAR_E,
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
    children: getBlockChildren(Block.Ids.ECpC_SET_VAR_E, 2, 2),
  },
  listNumber: {
    blockId: Block.Ids.FpF_LIST_ELEMENT_Fp,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.FpF_LIST_ELEMENT_Fp, 2, 2),
  },
  listObject: {
    blockId: Block.Ids.OpF_LIST_ELEMENT_Op,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.OpF_LIST_ELEMENT_Op, 2, 2),
  },
  listVector: {
    blockId: Block.Ids.VpF_LIST_ELEMENT_Vp,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VpF_LIST_ELEMENT_Vp, 2, 2),
  },
  listRotation: {
    blockId: Block.Ids.QpF_LIST_ELEMENT_Qp,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.QpF_LIST_ELEMENT_Qp, 2, 2),
  },
  listBoolean: {
    blockId: Block.Ids.TpF_LIST_ELEMENT_Tp,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.TpF_LIST_ELEMENT_Tp, 2, 2),
  },
  listConstraint: {
    blockId: Block.Ids.CpF_LIST_ELEMENT_Cp,
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
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.CpF_LIST_ELEMENT_Cp, 2, 2),
  },
  increase: {
    blockId: Block.Ids.EFp_INC_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFp_INC_VAR_E, 1, 2),
  },
  decrease: {
    blockId: Block.Ids.EFp_DEC_VAR_E,
    arguments: [
      {
        type: ArgumentTypes.Wire,
        offset: [0, 1, 3],
      },
    ],
    beforeOffset: [3, 1, 6],
    afterOffset: [3, 1, 0],
    children: getBlockChildren(Block.Ids.EFp_DEC_VAR_E, 1, 2),
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

  True: {
    blockId: Block.Ids.TRUE_T,
    arguments: [],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.TRUE_T, 1, 2),
  },
  False: {
    blockId: Block.Ids.FALSE_T,
    arguments: [],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.TRUE_T, 1, 2),
  },
  Number: {
    blockId: Block.Ids.NUMBER_F,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 4,
        required: false,
      },
    ],
    outputWires: [[14, 1, 3]],
    children: getBlockChildren(Block.Ids.NUMBER_F, 1, 2),
  },
  Vector: {
    blockId: Block.Ids.VECTOR_V,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 5,
        required: false,
      },
    ],
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.VECTOR_V, 2, 2),
  },
  Rotation: {
    blockId: Block.Ids.ROT_Q,
    arguments: [
      {
        type: ArgumentTypes.Parameter,
        index: 0,
        valueType: 5,
        required: false,
      },
    ],
    outputWires: [[14, 1, 11]],
    children: getBlockChildren(Block.Ids.ROT_Q, 2, 2),
  },
};
