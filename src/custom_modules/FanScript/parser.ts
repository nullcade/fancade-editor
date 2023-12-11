import { Chunk, Value } from "custom_modules/GameFormat";
import {
  ArgumentTypes,
  FanScript,
  FanScriptBlocks,
  SelectableParameters,
} from "./types";
import ts from "typescript";
import { nanoid } from "nanoid";
import ScriptBlockFaces from "./scriptBlockFaces";

function valueSolver(
  value: ts.Node,
  variableStack: {
    [key: string]:
      | number
      | string
      | boolean
      | { blockY: number; offset: [number, number, number] };
  },
  functionStack: {
    [key: string]: {};
  }
):
  | number
  | string
  | boolean
  | { blockY: number; offset: [number, number, number] } {
  if (ts.isParenthesizedExpression(value)) {
    return valueSolver(value.expression, variableStack, functionStack);
  }
  if (ts.isBinaryExpression(value)) {
    const left = valueSolver(value.left, variableStack, functionStack);
    const right = valueSolver(value.right, variableStack, functionStack);
    // if (typeof left !== typeof right) throw Error("Different type values");
    if (typeof left === "number" && typeof right === "number")
      switch (value.operatorToken.kind) {
        case 29:
          return left < right;
        case 31:
          return left > right;
        case 32:
          return left <= right;
        case 33:
          return left >= right;
        case 39:
          return left + right;
        case 40:
          return left - right;
        case 41:
          return left * right;
        case 42:
          return left ** right;
        case 43:
          return left / right;
        case 44:
          return left % right;
        case 50:
          return left & right;
        case 51:
          return left | right;
        case 52:
          return left ^ right;
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
    else if (typeof left === "boolean" && typeof right === "boolean")
      switch (value.operatorToken.kind) {
        case 29:
          return left < right;
        case 31:
          return left > right;
        case 32:
          return left <= right;
        case 33:
          return left >= right;
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
    else if (typeof left === "string" && typeof right === "string")
      switch (value.operatorToken.kind) {
        case 29:
          return left < right;
        case 31:
          return left > right;
        case 32:
          return left <= right;
        case 33:
          return left >= right;
        case 39:
          return left + right;
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
    else if (typeof left !== "number" && typeof right !== "number")
      switch (value.operatorToken.kind) {
        case 29:
          return left < right;
        case 31:
          return left > right;
        case 32:
          return left <= right;
        case 33:
          return left >= right;
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
    else if (typeof left === "number" && typeof right === "string")
      switch (value.operatorToken.kind) {
        case 39:
          return left + right;
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
    else if (typeof left === "string" && typeof right === "number")
      switch (value.operatorToken.kind) {
        case 39:
          return left + right;
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
    else
      switch (value.operatorToken.kind) {
        case 55:
          return left && right;
        case 56:
          return left || right;
        default:
          throw new Error("Wrong operation type!");
      }
  }
  if (ts.isPropertyAccessExpression(value)) {
    if (!(ts.isIdentifier(value.expression) && ts.isIdentifier(value.name)))
      throw new Error("Property access is only valid with solid names.");
    if (!SelectableParameters[value.expression.escapedText.toString()])
      throw new Error(
        `"${value.expression.escapedText.toString()}" is not defined`
      );
    const parameter =
      SelectableParameters[value.expression.escapedText.toString()][
        value.name.escapedText.toString()
      ];
    if (parameter === undefined)
      throw new Error(
        `${value.expression.escapedText.toString()} have no parameter "${value.name.escapedText.toString()}"`
      );
    return parameter;
  }
  if (ts.isNumericLiteral(value)) return parseInt(value.text);
  if (ts.isStringLiteral(value)) return value.text;
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (value.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(value)) {
    if (!variableStack[value.text])
      throw new Error(`"${value.text}" is not defined`);
    return variableStack[value.text];
  }
  return false;
}

function parseProgramStatement(
  statement: ts.Node,
  stack: {
    afterStack: { blockY: number; offset: [number, number, number] }[];
    beforeStack: { blockY: number; offset: [number, number, number] }[];
    variableStack: {
      [key: string]:
        | number
        | string
        | boolean
        | { blockY: number; offset: [number, number, number] };
    };
    functionStack: {
      [key: string]: {};
    };
  },
  result: FanScript.Result
) {
  const myExpression = ts.isExpressionStatement(statement)
    ? statement.expression
    : statement;
  if (
    ts.isCallExpression(myExpression) &&
    ts.isIdentifier(myExpression.expression)
    // funxtion call
  ) {
    console.log(stack);
    const funcName = myExpression.expression.escapedText.toString();
    console.log(funcName);
    if (!FanScriptBlocks[funcName]) return;
    const wires: {
      position: [[number, number, number], [number, number, number]];
      offset: [[number, number, number], [number, number, number]];
    }[] = [];
    const values: Value.Data[] = [];
    if (stack.afterStack.length > 0) {
      wires.push({
        position: [
          stack.afterStack[stack.afterStack.length - 1].blockY === 32769
            ? [32769, 32769, 32769]
            : [0, stack.afterStack[stack.afterStack.length - 1].blockY, 0],
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
    myExpression.arguments.forEach((value, index) => {
      const argumentType = FanScriptBlocks[funcName].arguments[index];
      if (!argumentType) throw new Error("Argument out of index");
      const realValue = valueSolver(
        value,
        stack.variableStack,
        stack.functionStack
      );
      if (argumentType.type === ArgumentTypes.Parameter) {
        if (
          !(
            typeof realValue === "string" ||
            typeof realValue === "number" ||
            typeof realValue === "boolean"
          )
        )
          throw new Error("Wires are not assignable to parameters!");
        if (!realValue) return;
        values.push({
          index: argumentType.index,
          position: [0, result.blocks.length, 0],
          type: argumentType.valueType,
          value:
            typeof realValue === "boolean" ? (realValue ? 1 : 0) : realValue,
        });
      } else if (argumentType.type === ArgumentTypes.Wire) {
        if (
          typeof realValue === "string" ||
          typeof realValue === "number" ||
          typeof realValue === "boolean"
        )
          throw new Error("Parameters are not assignable to wires!");
        wires.push({
          position: [
            [0, realValue.blockY, 0],
            [0, result.blocks.length, 0],
          ],
          offset: [
            realValue.offset,
            argumentType.offset,
          ],
        });
      }
    });
    result.blocks.push({
      id: FanScriptBlocks[funcName].blockId,
      name: funcName,
      wires,
      values,
    });
    return {
      blockY: result.blocks.length - 1,
      wiresOffset: FanScriptBlocks[funcName].outputWires,
    };
  } else if (
    ts.isVariableStatement(statement)
    //variable assignment
  ) {
    if (!(statement.declarationList.flags & ts.NodeFlags.Const))
      throw new Error("Only const variables are possible!");
    statement.declarationList.forEachChild((child) => {
      if (!ts.isVariableDeclaration(child))
        throw new Error("Invalid variable declaration type");
      if (!child.initializer) throw new Error("Wrong variable assignment");
      if (
        ts.isCallExpression(child.initializer) &&
        !ts.isArrayBindingPattern(child.name)
      )
        throw new Error(
          "Cannot assign function calls to anything other than arrays."
        );
      if (
        !ts.isCallExpression(child.initializer) &&
        ts.isArrayBindingPattern(child.name)
      )
        throw new Error("Can only assign function calls to arrays.");
      if (
        ts.isCallExpression(child.initializer) &&
        ts.isArrayBindingPattern(child.name)
      ) {
        const outputWires = parseProgramStatement(
          child.initializer,
          stack,
          result
        ) ?? { blockY: 0, wiresOffset: [] };
        child.name.elements.forEach((element, elementIndex) => {
          if (!ts.isBindingElement(element))
            throw new Error(
              "Function calls are only assignable to simple arrays."
            );
          if (!ts.isIdentifier(element.name))
            throw new Error(
              "Function calls are only assignable to name arrays."
            );
          if (
            !(
              outputWires.wiresOffset &&
              elementIndex < outputWires.wiresOffset?.length
            )
          )
            throw new Error("Argument out of index.");
          stack.variableStack[element.name.escapedText.toString()] = {
            blockY: outputWires.blockY,
            offset: outputWires.wiresOffset[elementIndex],
          };
        });
      } else if (ts.isIdentifier(child.name)) {
        stack.variableStack[child.name.text] = valueSolver(
          child.initializer,
          stack.variableStack,
          stack.functionStack
        );
      }
    });
  }
}

export function parse(script: string): FanScript.Result {
  const scriptObject = ts.createSourceFile(
    "x.ts",
    script,
    ts.ScriptTarget.Latest
  );
  const afterStack: { blockY: number; offset: [number, number, number] }[] = [
    { blockY: 32769, offset: [3, 1, 14] },
  ];
  const beforeStack: { blockY: number; offset: [number, number, number] }[] =
    [];
  const variableStack: {
    [key: string]:
      | number
      | string
      | boolean
      | { blockY: number; offset: [number, number, number] };
  } = {};
  const functionStack: { [key: string]: {} } = {};
  console.log(ts.isExpressionStatement(scriptObject.statements[0]));
  const result: FanScript.Result = {
    originalScript: script,
    blocks: [],
    newBlocks: [],
  };
  scriptObject.statements.forEach((item, index, statementsArray) => {
    parseProgramStatement(
      item,
      { afterStack, beforeStack, variableStack, functionStack },
      result
    );
    if (index === statementsArray.length - 1 && result.blocks.length > 0) {
      result.blocks[result.blocks.length - 1].wires.push({
        position: [
          [0, afterStack[afterStack.length - 1].blockY, 0],
          [32769, 32769, 32769],
        ],
        offset: [afterStack[afterStack.length - 1].offset, [3, 1, 0]],
      });
    }
  });
  console.log(result);
  console.log("vars");
  console.log(variableStack);
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
            new Array(4).fill(new Array(blocksArray.length).fill(new Array(4)))
          )
        ),
        faces: ScriptBlockFaces.bottomLeft,
        values: [
          {
            index: 0,
            type: Value.Type.ExePin,
            position: [3, 1, 14],
            value: "Before",
          },
          {
            index: 1,
            type: Value.Type.ExePin,
            position: [3, 1, 0],
            value: "After",
          },
        ],
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
    myChunk.values.push(...block.values);
  });

  return arr;
}
