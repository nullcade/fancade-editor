import { FanScript, FanScriptFunctions } from "./types";
import * as ts from "typescript";

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
    if (!FanScriptFunctions[funcName]) return;
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
          FanScriptFunctions[funcName].beforeOffset,
        ],
      });
      stack.afterStack[stack.afterStack.length - 1] = {
        blockY: result.blocks.length,
        offset: FanScriptFunctions[funcName].afterOffset,
      };
    } else {
      stack.afterStack.push({
        blockY: result.blocks.length,
        offset: FanScriptFunctions[funcName].afterOffset,
      });
    }
    result.blocks.push({
      id: FanScriptFunctions[funcName].blockId,
      name: funcName,
      wires,
    });
  }
}

export function parse(script: string): FanScript.Result | void {
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
}
