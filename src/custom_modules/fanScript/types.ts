import { Block } from "custom_modules/GameFormat";

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
      wires: {
        before?: RequireOnlyOne<
          {
            blockY: number;
            after: boolean;
            parameter: number;
          },
          "after" | "parameter"
        >;
        after?: RequireOnlyOne<
          {
            blockY: number;
            before: true;
            parameter: ParameterId;
          },
          "before" | "parameter"
        >;
        parameters?: {
          [key in ParameterId]: {
            blockY: number;
            parameter: ParameterId;
          }[];
        };
      };
    }[];
    newBlocks: {
      id: Block.Id;
      pins: RequireOnlyOne<
        {
          execute: 0 | 1;
          parameter: { id: ParameterId; type: number, name: string };
        },
        "execute" | "parameter"
      >[];
      blocks: {
        id: Block.Id;
        wires: {
          before?: RequireOnlyOne<
            {
              blockY: number;
              after: boolean;
              parameter: number;
            },
            "after" | "parameter"
          >;
          after?: RequireOnlyOne<
            {
              blockY: number;
              before: true;
              parameter: ParameterId;
            },
            "before" | "parameter"
          >;
          parameters?: {
            [key in ParameterId]: {
              blockY: number;
              parameter: ParameterId;
            }[];
          };
        };
      }[];
    }[];
  }
}
