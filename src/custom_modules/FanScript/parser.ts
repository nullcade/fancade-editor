import { Chunk } from "custom_modules/GameFormat";
import { FanScript, FanScriptBlocks } from "./types";
import ts from "typescript";
import { nanoid } from "nanoid";
import ScriptBlockFaces from "./scriptBlockFaces";

function parseProgramStatement(
  statement: ts.Statement,
  stack: {
    afterStack: { blockY: number; offset: [number, number, number] }[];
    beforeStack: { blockY: number; offset: [number, number, number] }[];
  },
  result: FanScript.Result
) {
  if (
    ts.isExpressionStatement(statement) &&
    ts.isCallExpression(statement.expression) &&
    ts.isIdentifier(statement.expression.expression)
    // funxtion call
  ) {
    console.log(stack);
    const funcName = statement.expression.expression.escapedText.toString();
    console.log(funcName);
    if (!FanScriptBlocks[funcName]) return;
    const wires: {
      position: [[number, number, number], [number, number, number]];
      offset: [[number, number, number], [number, number, number]];
    }[] = [];
    if (stack.afterStack.length > 0) {
      wires.push({
        position: [
          [0, stack.afterStack[stack.afterStack.length - 1].blockY, 0],
          [0, result.blocks.length, 0],
        ],
        offset: [
          stack.afterStack[stack.afterStack.length - 1].offset,
          FanScriptBlocks[funcName].beforeOffset,
        ],
      });
      stack.afterStack[stack.afterStack.length - 1] = {
        blockY: result.blocks.length,
        offset: FanScriptBlocks[funcName].afterOffset,
      };
    } else {
      stack.afterStack.push({
        blockY: result.blocks.length,
        offset: FanScriptBlocks[funcName].afterOffset,
      });
    }
    result.blocks.push({
      id: FanScriptBlocks[funcName].blockId,
      name: funcName,
      wires,
    });
  }
}

export function parse(script: string): FanScript.Result {
  const scriptObject = ts.createSourceFile(
    "x.ts",
    script,
    ts.ScriptTarget.Latest
  );
  const afterStack: { blockY: number; offset: [number, number, number] }[] = [];
  const beforeStack: { blockY: number; offset: [number, number, number] }[] =
    [];
  console.log(ts.isExpressionStatement(scriptObject.statements[0]));
  const result: FanScript.Result = {
    originalScript: script,
    blocks: [],
    newBlocks: [],
  };
  scriptObject.statements.forEach((item) =>
    parseProgramStatement(item, { afterStack, beforeStack }, result)
  );
  console.log(result);
  return result;
}

export function fancadeResult(
  result: FanScript.Result
): (Chunk.Data & { type: Chunk.Type.Script; offset: [0, 0, 0] })[] {
  const arr: (Chunk.Data & { type: Chunk.Type.Script; offset: [0, 0, 0] })[] =
    [];
  result.blocks.forEach((block, index, blocksArray) => {
    if (index === 0) {
      arr.push({
        uuid: nanoid(),
        type: Chunk.Type.Script,
        offset: [0, 0, 0],
        name: "scriptBlock",
        locked: false,
        blocks: JSON.parse(
          JSON.stringify(
            blocksArray.length > 4
              ? new Array(blocksArray.length).fill(
                  new Array(blocksArray.length).fill(
                    new Array(blocksArray.length)
                  )
                )
              : new Array(4).fill(new Array(4).fill(new Array(4)))
          )
        ),
        faces: ScriptBlockFaces.bottomLeft,
        values: [],
        wires: [],
        children: [
          {
            uuid: nanoid(),
            values: [],
            blocks: [],
            wires: [],
            faces: ScriptBlockFaces.bottomRight,
            offset: [1, 0, 0],
          },
          {
            uuid: nanoid(),
            values: [],
            blocks: [],
            wires: [],
            faces: ScriptBlockFaces.topLeft,
            offset: [0, 0, 1],
          },
          {
            uuid: nanoid(),
            values: [],
            blocks: [],
            wires: [],
            faces: ScriptBlockFaces.topRight,
            offset: [1, 0, 1],
          },
        ],
      });
    }
    const myChunk = arr[arr.length - 1];
    myChunk.blocks[0][index][0] = block.id;
    FanScriptBlocks[block.name].children.forEach((child) => {
      myChunk.blocks[child.offset[0]][index][child.offset[2]] = child.blockId;
    });
    myChunk.wires.push(...block.wires);
  });
  
  return arr;
}
