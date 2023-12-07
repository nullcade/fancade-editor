export type Vec<T = number> = [x: T, y: T, z: T];

export namespace Game {
  export interface Data {
    appVersion: number;
    title: string;
    author: string;
    description: string;
    idOffset: number;
    chunks: Chunk.Data[];
  }
}
export namespace Chunk {
  export interface Data {
    uuid: string;
    type: Type;
    name?: string;
    parent?: number;
    offset?: Vec;
    locked: boolean;
    collider?: Collider;
    color?: Color.Id;
    faces?: Faces;
    blocks: Blocks;
    values: Value.Data[];
    wires: Wire.Data[];
    children?: (Pick<
      Chunk.Data,
      "uuid" | "offset" | "faces" | "blocks" | "values" | "wires"
    > & { offset: Vec })[];
  }
  export enum Flags {
    HasWires = 2 ** 0,
    HasValues = 2 ** 1,
    HasBlocks = 2 ** 2,
    HasFaces = 2 ** 3,
    IsMulti = 2 ** 4,
    HasCollider = 2 ** 5,
    IsLocked = 2 ** 6,
    HasColor = 2 ** 8,
    HasName = 2 ** 10,
    HasType = 2 ** 11,
  }
  export enum Type {
    /** @abstract */
    Rigid = 0x00,
    Physics = 0x01,
    Script = 0x02,
    Level = 0x03,
  }
  export enum Collider {
    Passthrough = 0x00,
    /** @abstract */
    Box = 0x01,
    Sphere = 0x02,
  }
  export type Faces = Color.Id[][][][];
  export type Blocks = Block.Id[][][];
}
export namespace Value {
  export interface Data<Type = Value.Type> {
    index: number;
    position: Vec;
    type: Type;
    value: Value;
  }
  export enum Type {
    /** `INT` */
    Int = 0x01,
    /** `LONG` */
    Long = 0x02,
    /** `FLOAT` */
    Float = 0x04,
    /** `FLOAT[3]` */
    Vec = 0x05,
    /** `STRING`  */
    Str = 0x06,
    /** `STRING`  */
    ExePin = 0x07,
    /** `STRING`  */
    NumPin = 0x08,
    /** `STRING`  */
    This = 0x09,
    /** `STRING`  */
    VecPin = 0x0a,
    /** `STRING`  */
    RotPin = 0x0c,
    /** `STRING`  */
    TruPin = 0x0e,
    /** `STRING`  */
    ObjPin = 0x10,
    /** `STRING`  */
    ConPin = 0x12,
  }
  export type Value = number | Vec | string;
}
export namespace Wire {
  export interface Data {
    position: readonly [Vec, Vec];
    offset: readonly [Vec, Vec];
  }
}
export namespace Block {
  /** A 2 byte id or string uuid used to reference blocks. */
  export type Id = Ids | (number & {}) | string;
  /** The 2 byte ids used to reference blocks. */
  export enum Ids {
    /** @abstract */
    EMPTY = 0x00,
    STONE_BLOCK = 0x01,
    BRICKS = 0x02,
    GRASS_A = 0x03,
    GRASS_B = 0x04,
    DIRT = 0x05,
    WOOD_X = 0x06,
    WOOD_Y = 0x07,
    WOOD_Z = 0x08,
    L2R = 0x09,
    MULTI_IN = 0x0a,
    MULTI_OUT = 0x0b,
    MULTI_IN_E = 0x0c,
    MULTI_OUT_E = 0x0d,
    THIS_O = 0x0e,
    COMMENT = 0x0f,
    EF_INSPECT_E = 0x10,
    EV_INSPECT_E = 0x14,
    EQ_INSPECT_E = 0x18,
    ET_INSPECT_E = 0x1c,
    EO_INSPECT_E = 0x20,
    NUMBER_F = 0x24,
    VECTOR_V = 0x26,
    ROT_Q = 0x2a,
    VAR_Fp = 0x2e,
    VAR_Vp = 0x30,
    VAR_Qp = 0x32,
    VAR_Tp = 0x34,
    VAR_Op = 0x36,
    VAR_Cp = 0x38,
    EFpF_SET_VAR_E = 0x3a,
    EVpV_SET_VAR_E = 0x3e,
    EQpQ_SET_VAR_E = 0x42,
    ETpT_SET_VAR_E = 0x46,
    EOpO_SET_VAR_E = 0x4a,
    ECpC_SET_VAR_E = 0x4e,
    FpF_LIST_ELEMENT_Fp = 0x52,
    VpF_LIST_ELEMENT_Fp = 0x56,
    F_NEG_F = 0x5a,
    FF_ADD_F = 0x5c,
    VV_ADD_V = 0x60,
    FF_SUB_F = 0x64,
    VV_SUB_V = 0x68,
    FF_MUL_F = 0x6c,
    VF_MUL_V = 0x70,
    VQ_MUL_V = 0x74,
    QQ_MUL_Q = 0x78,
    FF_DIV_F = 0x7c,
    FF_LT_T = 0x80,
    FF_EQL_T = 0x84,
    VV_EQL_T = 0x88,
    OO_EQL_T = 0x8c,
    T_NOT_T = 0x90,
    TT_AND_T = 0x92,
    FFF_JOIN_V = 0x96,
    V_SPLIT_FFF = 0x9c,
    FFF_EULER_Q = 0xa2,
    FF_RANDOM_F = 0xa8,
    FF_MOD_F = 0xac,
    FF_MIN_F = 0xb0,
    FF_MAX_F = 0xb4,
    F_ROUND_F = 0xb8,
    F_FLOOR_F = 0xba,
    F_CEIL_F = 0xbc,
    VV_DIST_F = 0xbe,
    QQF_LERP_Q = 0xc2,
    VF_AXIS_ANG_Q = 0xc8,
    VV_LOOK_ROT_Q = 0xcc,
    VVVV_LINE_VS_PLANE_V = 0xd0,
    FF_S2W_VV = 0xd8,
    SCREEN_SIZE_FF = 0xdc,
    ACCELEROMETER_V = 0xe0,
    VV_RAYCAST_TVO = 0xe4,
    ET_IF_EEE = 0xea,
    E_PLAY_EE = 0xee,
    E_TOUCH_EFFE = 0xf2,
    E_SWIPE_EVE = 0xf8,
    E_WIN_E = 0xfc,
    E_LOSE_E = 0x100,
    EFF_SET_SCORE_E = 0x104,
    EFF_SFX_PLAY_FE = 0x108,
    EVQF_SET_CAM_E = 0x10c,
    EVQ_SET_LIT_E = 0x112,
    O_GET_POS_VQ = 0x116,
    EOVQ_SET_POS_E = 0x11a,
    O_GET_VEL_VV = 0x120,
    EOVV_SET_VEL_E = 0x124,
    EOVVV_ADD_FORCE_E = 0x12a,
    EOT_SET_VISIBLE_E = 0x132,
    EOVV_SET_LOCKED_E = 0x136,
    EO_CREATE_EO = 0x13c,
    EO_DESTROY_E = 0x140,
    EV_SET_GRAVITY_E = 0x144,
    EOF_SET_MASS_E = 0x148,
    EOF_SET_FRICTION_E = 0x14c,
    EOF_SET_BOUNCE_E = 0x150,
    EOOV_ADD_CONSTRAINT_EC = 0x154,
    ECVV_SET_LIN_LIMITS_E = 0x15a,
    ECVV_SET_ANG_LIMITS_E = 0x160,
    ECVV_SET_LIN_SPRING_E = 0x166,
    ECVV_SET_ANG_SPRING_E = 0x16c,
    ECVV_SET_LIN_MOTOR_E = 0x172,
    ECVV_SET_ANG_MOTOR_E = 0x178,
    FOLDER_UNKNOWN = 0x17e,
    SWIPE_CHICK = 0x17f,
    DIRT_SLAB = 0x180,
    STEEL = 0x181,
    ARCH = 0x182,
    OBSTACLE = 0x184,
    GOAL = 0x185,
    BUTTON = 0x186,
    EFFF_VOLUME_PITCH_E = 0x187,
    EF_SFX_STOP_E = 0x18d,
    EO_COLLISION_EOFVE = 0x191,
    E_SCREENSHOT_EE = 0x199,
    F_SIN_F = 0x19d,
    FOLDER_EMPTY = 0x19f,
    FOLDER_LOCKED = 0x1a0,
    TT_OR_T = 0x1a1,
    TT_EQL_T = 0x1a5,
    BOX = 0x1a9,
    BALL = 0x1aa,
    TILT_BALL = 0x1ab,
    EF_SET_VAR_E = 0x1ac,
    EV_SET_VAR_E = 0x1ae,
    EQ_SET_VAR_E = 0x1b0,
    ET_SET_VAR_E = 0x1b2,
    EO_SET_VAR_E = 0x1b4,
    EC_SET_VAR_E = 0x1b6,
    Q_INV_Q = 0x1b8,
    Q_EULER_FFF = 0x1ba,
    PASS_THROUGH = 0x1c0,
    TRUE_T = 0x1c1,
    FALSE_T = 0x1c3,
    F_COS_F = 0x1c5,
    F_ABS_F = 0x1c7,
    FF_POW_F = 0x1c9,
    VpF_LIST_ELEMENT_Vp = 0x1cd,
    QpF_LIST_ELEMENT_Qp = 0x1d1,
    TpF_LIST_ELEMENT_Tp = 0x1d5,
    CpF_LIST_ELEMENT_Cp = 0x1d9,
    V_W2S_FF = 0x1dd,
    FF_GT_T = 0x1e1,
    EF_RANDOM_SEED_E = 0x1e5,
    O_GET_SIZE_VV = 0x1e9,
    DIRT_B = 0x1ed,
    FLOWERS = 0x1ee,
    FOLIAGE = 0x1ef,
    FOLIAGE_B = 0x1f0,
    FOLIAGE_TOP = 0x1f1,
    FOLIAGE_BOT = 0x1f2,
    FOLIAGE_SLAB = 0x1f3,
    SHRUB = 0x1f4,
    STONE = 0x1f5,
    STONE_B = 0x1f6,
    STONE_TOP = 0x1f7,
    STONE_BOT = 0x1f8,
    STONE_SLAB = 0x1f9,
    STONE_PILLAR = 0x1fa,
    STONE_LOWER = 0x1fb,
    WOOD_LOWER_X = 0x1fc,
    WOOD_LOWER_Y = 0x1fd,
    WOOD_UPPER_X = 0x1fe,
    WOOD_UPPER_Y = 0x1ff,
    STICK_X = 0x200,
    STICK_Y = 0x201,
    STICK_Z = 0x202,
    STICK_NE = 0x203,
    STICK_NW = 0x204,
    STICK_SW = 0x205,
    STICK_SE = 0x206,
    STICK_UE = 0x207,
    STICK_UN = 0x208,
    STICK_UW = 0x209,
    STICK_US = 0x20a,
    STICK_DE = 0x20b,
    STICK_DN = 0x20c,
    STICK_DW = 0x20d,
    STICK_DS = 0x20e,
    MOTOR_X = 0x20f,
    MOTOR_Y = 0x210,
    MOTOR_Z = 0x211,
    SLIDER_X = 0x212,
    SLIDER_Y = 0x213,
    SLIDER_Z = 0x214,
    BUTTON_B = 0x215,
    WHEEL = 0x216,
    DASH_CAT = 0x217,
    MARKER = 0x218,
    DINO = 0x219,
    DINO_RED = 0x21a,
    BUTTERFLY = 0x21b,
    CAMERA_ORBIT = 0x21c,
    SLIDER = 0x220,
    SCRIPT = 0x221,
    SPHERE = 0x222,
    SLATE = 0x223,
    SLATE_B = 0x224,
    SLATE_NE = 0x225,
    SLATE_NW = 0x226,
    SLATE_SE = 0x227,
    SLATE_SW = 0x228,
    SLATE_TOP = 0x229,
    SLATE_BOT = 0x22a,
    PARTICLE = 0x22b,
    EFp_INC_VAR_E = 0x22c,
    EFp_DEC_VAR_E = 0x22e,
    EFF_LOOP_EFE = 0x230,
    FRAME_F = 0x234,
    E_LATE_UPDATE_EE = 0x236,
    VV_DOT_F = 0x23a,
    VV_CROSS_V = 0x23e,
    V_NORMALIZE_V = 0x242,
    FF_LOG_F = 0x244,
    EFpO_MENU_ITEM_E = 0x248,
    E_BUT_SENSOR_EE = 0x24c,
    E_JOY_SENSOR_VE = 0x250,
    IO = 0x254,
  }
}
export namespace Color {
  /** A color id used to store background and block color. */
  export type Id = (number & {}) | Ids;
  /** The color ids used to store background and block color. */
  export enum Ids {
    /** @abstract `Glue` */
    Empty = 0x00,
    /** `#1E1E26` `Glue` */
    Black = 0x01,
    /** `#424252` `Glue` */
    Gray4 = 0x02,
    /** `#696B7C` `Glue` */
    Gray3 = 0x03,
    /** `#9699A9` `Glue` */
    Gray2 = 0x04,
    /** `#C6C9D3` `Glue` */
    Gray1 = 0x05,
    /** `#FFFFFF` `Glue` */
    White = 0x06,
    /** `#985660` `Glue` */
    DarkBrown = 0x07,
    /** `#C57184` `Glue` */
    Brown = 0x08,
    /** `#E79F9D` `Glue` */
    LightBrown = 0x09,
    /** `#FFBCAE` `Glue` */
    DarkTan = 0x0a,
    /** `#FFDFC8` `Glue` */
    Tan = 0x0b,
    /** `#FFF9F7` `Glue` */
    LightTan = 0x0c,
    /** `#C73853` `Glue` */
    DarkRed = 0x0d,
    /** `#FF4E6F` `Glue` */
    Red = 0x0e,
    /** `#FFA4A4` `Glue` */
    LightRed = 0x0f,
    /** `#D15544` `Glue` */
    DarkOrange = 0x10,
    /** `#FF7758` `Glue` */
    Orange = 0x11,
    /** `#FFB389` `Glue` */
    LightOrange = 0x12,
    /** `#F0B300` `Glue` */
    DarkYellow = 0x13,
    /** `#FFE200` `Glue` */
    Yellow = 0x14,
    /** `#FFFF81` `Glue` */
    LightYellow = 0x15,
    /** `#008F50` `Glue` */
    DarkGreen = 0x16,
    /** `#45C952` `Glue` */
    Green = 0x17,
    /** `#BBFF72` `Glue` */
    LightGreen = 0x18,
    /** `#0071E5` `Glue` */
    DarkBlue = 0x19,
    /** `#0096FF` `Glue` */
    Blue = 0x1a,
    /** `#00C9FF` `Glue` */
    LightBlue = 0x1b,
  }
  export enum Ids {
    /** @abstract `No Glue` */
    EmptyU = Empty + 0x80,
    /** `#1E1E26` `No Glue` */
    BlackU = Black + 0x80,
    /** `#424252` `No Glue` */
    Gray4U = Gray4 + 0x80,
    /** `#696B7C` `No Glue` */
    Gray3U = Gray3 + 0x80,
    /** `#9699A9` `No Glue` */
    Gray2U = Gray2 + 0x80,
    /** `#C6C9D3` `No Glue` */
    Gray1U = Gray1 + 0x80,
    /** `#FFFFFF` `No Glue` */
    WhiteU = White + 0x80,
    /** `#985660` `No Glue` */
    DarkBrownU = DarkBrown + 0x80,
    /** `#C57184` `No Glue` */
    BrownU = Brown + 0x80,
    /** `#E79F9D` `No Glue` */
    LightBrownU = LightBrown + 0x80,
    /** `#FFBCAE` `No Glue` */
    DarkTanU = DarkTan + 0x80,
    /** `#FFDFC8` `No Glue` */
    TanU = Tan + 0x80,
    /** `#FFF9F7` `No Glue` */
    LightTanU = LightTan + 0x80,
    /** `#C73853` `No Glue` */
    DarkRedU = DarkRed + 0x80,
    /** `#FF4E6F` `No Glue` */
    RedU = Red + 0x80,
    /** `#FFA4A4` `No Glue` */
    LightRedU = LightRed + 0x80,
    /** `#D15544` `No Glue` */
    DarkOrangeU = DarkOrange + 0x80,
    /** `#FF7758` `No Glue` */
    OrangeU = Orange + 0x80,
    /** `#FFB389` `No Glue` */
    LightOrangeU = LightOrange + 0x80,
    /** `#F0B300` `No Glue` */
    DarkYellowU = DarkYellow + 0x80,
    /** `#FFE200` `No Glue` */
    YellowU = Yellow + 0x80,
    /** `#FFFF81` `No Glue` */
    LightYellowU = LightYellow + 0x80,
    /** `#008F50` `No Glue` */
    DarkGreenU = DarkGreen + 0x80,
    /** `#45C952` `No Glue` */
    GreenU = Green + 0x80,
    /** `#BBFF72` `No Glue` */
    LightGreenU = LightGreen + 0x80,
    /** `#0071E5` `No Glue` */
    DarkBlueU = DarkBlue + 0x80,
    /** `#0096FF` `No Glue` */
    BlueU = Blue + 0x80,
    /** `#00C9FF` `No Glue` */
    LightBlueU = LightBlue + 0x80,
  }
}

export type Grid<
  N extends readonly number[] | readonly [],
  T = number,
  Acc extends never[] = [],
  S extends number = N["length"]
> = Acc["length"] extends S
  ? T
  : Grid<N, Fill<[never, ...Acc, ...N][S], T>, [...Acc, never], S>;
export type Fill<
  N extends number,
  T = undefined,
  Acc extends T[] = []
> = number extends N
  ? T[]
  : N extends Acc["length"]
  ? Acc
  : Fill<N, T, [...Acc, T]>;
export type Multiply<
  A extends number,
  B extends number,
  Acc extends undefined[] = [],
  I extends never[] = []
> = I["length"] extends A
  ? Acc["length"]
  : Multiply<A, B, [...Acc, ...Fill<B>], [...I, never]>;
