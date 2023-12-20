import { Chunk, Value } from "custom_modules/GameFormat";
import {
  ArgumentTypes,
  FanScript,
  FanScriptBlocks,
  FunctionArgument,
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
    [key: string]: {
      body: ts.Block;
      parameters: string[];
      wiresStart: number;
    };
  },
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
    if (!SelectableParameters[value.expression.text])
      throw new Error(`"${value.expression.text}" is not defined`);
    const parameter =
      SelectableParameters[value.expression.text][value.name.text];
    if (parameter === undefined)
      throw new Error(
        `${value.expression.text} have no parameter "${value.name.text}"`,
      );
    return parameter;
  }
  if (ts.isNumericLiteral(value)) return parseFloat(value.text);
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
      [key: string]: {
        body: ts.Block;
        parameters: string[];
        wiresStart: number;
      };
    };
  },
  chunks: Chunk.Data[],
  result: FanScript.Result,
) {
  const myExpression = ts.isExpressionStatement(statement)
    ? statement.expression
    : statement;
  if (
    ts.isCallExpression(myExpression) &&
    ts.isIdentifier(myExpression.expression)
    // funxtion call
  ) {
    const funcName = myExpression.expression.text;
    if (funcName === "Object") {
      const [blockId, offsetX, offsetY, offsetZ] = myExpression.arguments.map(
        (argument) =>
          valueSolver(argument, stack.variableStack, stack.functionStack),
      );
      if (!(typeof blockId === "string" || typeof blockId === "number"))
        throw new Error("blockId can only be a number or string");
      if (
        typeof offsetX !== "number" ||
        typeof offsetY !== "number" ||
        typeof offsetZ !== "number"
      )
        throw new Error(
          "Object function can only take number values for wire position.",
        );
      const blockY = result.blocks.length;
      if (typeof blockId === "number") {
        result.blocks.push({
          id: blockId,
          name: "",
          wires: [],
          values: [],
        });
        if (blockId === SelectableParameters["Blocks"]["ARCH"]) {
          result.blocks.push({
            id: blockId + 1,
            name: "",
            wires: [],
            values: [],
          });
        }
      } else {
        const onlyChunks = chunks.filter((item) => item.uuid === blockId);
        if (onlyChunks.length === 0)
          throw new Error(`uuid "${blockId}" not found!`);
        const blockChunk = onlyChunks[0];
        let height = Math.max(
          blockChunk.offset ? blockChunk.offset[1] : 0,
          ...(blockChunk.children
            ? blockChunk.children.map((child) => child.offset[1])
            : []),
        );
        result.blocks.push({
          id: blockId,
          name: "",
          wires: [],
          values: [],
        });
        for (let i = 0; i <= height; i++)
          result.blocks.push({
            id: 0,
            name: "",
            wires: [],
            values: [],
          });
      }
      return [
        {
          blockY,
          offset: [offsetX, offsetY, offsetZ] as [number, number, number],
        },
      ];
    }
    if (funcName === "Boolean") {
      if (myExpression.arguments.length > 1)
        throw new Error(`Cannot pass more than 1 parameters to "${funcName}"`);
      const realValue = valueSolver(
        myExpression.arguments[0],
        stack.variableStack,
        stack.functionStack,
      );
      if (typeof realValue !== "boolean")
        throw new Error(`"${funcName}" only accepts number as parameter`);
      result.blocks.push({
        id: FanScriptBlocks[realValue ? "True" : "False"].blockId,
        name: realValue ? "True" : "False",
        wires: [],
        values: [],
      });
      const outputWires =
        FanScriptBlocks[realValue ? "True" : "False"].outputWires ?? [];
      return [
        {
          blockY: result.blocks.length - 1,
          offset: outputWires[0] ?? [14, 1, 3],
        },
      ];
    }
    if (funcName === "Number") {
      if (myExpression.arguments.length > 1)
        throw new Error(`Cannot pass more than 1 parameters to "${funcName}"`);
      const realValue = valueSolver(
        myExpression.arguments[0],
        stack.variableStack,
        stack.functionStack,
      );
      if (typeof realValue !== "number")
        throw new Error(`"${funcName}" only accepts number as parameter`);
      result.blocks.push({
        id: FanScriptBlocks[funcName].blockId,
        name: funcName,
        wires: [],
        values:
          realValue === 0
            ? []
            : [
                {
                  index: 0,
                  position: [0, result.blocks.length, 0],
                  type: 4,
                  value: realValue,
                },
              ],
      });
      const outputWires = FanScriptBlocks[funcName].outputWires ?? [];
      return [
        {
          blockY: result.blocks.length - 1,
          offset: outputWires[0] ?? [14, 1, 3],
        },
      ];
    }
    if (funcName === "Vector" || funcName === "Rotation") {
      const vec: [number, number, number] = [0, 0, 0];
      myExpression.arguments.forEach((value, index) => {
        if (index > 2)
          throw new Error(
            `Cannot pass more than 3 parameters to "${funcName}"`,
          );
        const realValue = valueSolver(
          value,
          stack.variableStack,
          stack.functionStack,
        );
        if (typeof realValue !== "number")
          throw new Error(`"${funcName}" only accepts number as parameter`);
        vec[index] = realValue;
      });
      result.blocks.push({
        id: FanScriptBlocks[funcName].blockId,
        name: funcName,
        wires: [],
        values:
          vec[0] === 0 && vec[1] === 0 && vec[2] === 0
            ? []
            : [
                {
                  index: 0,
                  position: [0, result.blocks.length, 0],
                  type: 5,
                  value: vec,
                },
              ],
      });
      const outputWires = FanScriptBlocks[funcName].outputWires ?? [];
      return [
        {
          blockY: result.blocks.length - 1,
          offset: outputWires[0] ?? [14, 1, 11],
        },
      ];
    }
    if (!FanScriptBlocks[funcName] && !stack.functionStack[funcName])
      throw new Error(`"${funcName}" is not a function name`);
    const wires: {
      position: [[number, number, number], [number, number, number]];
      offset: [[number, number, number], [number, number, number]];
    }[] = [];
    const values: Value.Data[] = [];
    let skips = 0;
    if (stack.functionStack[funcName]) {
      const tempVariableStack: {
        [key: string]:
          | number
          | string
          | boolean
          | { blockY: number; offset: [number, number, number] };
      } = {};
      myExpression.arguments.forEach((argument, index) => {
        if (ts.isSpreadElement(argument)) {
          if (!ts.isCallExpression(argument.expression))
            throw new Error("Spreading is only supported for function calls");
          if (index < stack.functionStack[funcName].wiresStart)
            throw new Error(
              "Cannot pass Spreaded function as parameter, please fill in the parameters first",
            );
          const realValue =
            parseProgramStatement(argument.expression, stack, chunks, result) ??
            [];
          if (realValue.length === 0)
            throw new Error(
              "Function has no output, call it instead of passing it as an argument",
            );
          realValue.forEach((wireValue, outputIndex) => {
            if (
              !(
                stack.functionStack[funcName].parameters.length >
                index + skips + outputIndex
              )
            )
              return;
            tempVariableStack[
              stack.functionStack[funcName].parameters[
                index + skips + outputIndex
              ]
            ] = wireValue;
          });
          skips += realValue.length - 1;
          return;
        }
        const realValue = valueSolver(
          argument,
          tempVariableStack,
          stack.functionStack,
        );
        tempVariableStack[
          stack.functionStack[funcName].parameters[index + skips]
        ] = realValue;
      });
      const outputValues: {
        blockY: number;
        offset: [number, number, number];
      }[] = [];
      stack.functionStack[funcName].body.statements.forEach(
        (statement, index, statements) => {
          if (index + 1 === statements.length) {
            if (!ts.isReturnStatement(statement))
              throw new Error("No return found in function.");
            if (!statement.expression) return;
            if (!ts.isArrayLiteralExpression(statement.expression))
              throw new Error("Only arrays are allowed for return statement.");
            statement.expression.elements.forEach((element) => {
              const realValue = valueSolver(
                element,
                tempVariableStack,
                stack.functionStack,
              );
              if (
                typeof realValue === "string" ||
                typeof realValue === "number" ||
                typeof realValue === "boolean"
              )
                throw new Error(
                  "Only wires are accepted as values to be returned.",
                );
              outputValues.push(realValue);
            });
            return;
          }
          if (ts.isReturnStatement(statement))
            throw new Error("Return can only be at the end of function");
          if (ts.isVariableStatement(statement))
            statement.declarationList.declarations.forEach((declaration) => {
              if (!declaration.initializer)
                throw new Error("Const declarations needs initializer.");
              if (ts.isArrowFunction(declaration.initializer))
                throw new Error("Cannot assign functions inside functions");
            });
          parseProgramStatement(
            statement,
            {
              afterStack: stack.afterStack,
              beforeStack: stack.beforeStack,
              variableStack: tempVariableStack,
              functionStack: stack.functionStack,
            },
            chunks,
            result,
          );
        },
      );
      return outputValues;
    }
    const callbacks: {
      argumentType: FunctionArgument;
      expression: ts.Expression;
    }[] = [];
    myExpression.arguments.forEach((value, index) => {
      if (!ts.isSpreadElement(value)) return;
      const argumentType = FanScriptBlocks[funcName].arguments[index + skips];
      if (!argumentType) throw new Error("Argument out of index");
      if (argumentType.type === ArgumentTypes.Wire && argumentType.callback) {
        callbacks.push({ argumentType: argumentType, expression: value });
        return;
      }
      if (!ts.isCallExpression(value.expression))
        throw new Error("Spreading is only supported for function calls");
      if (argumentType.type === ArgumentTypes.Parameter)
        throw new Error(
          "Cannot pass Spreaded function as parameter, please fill in the parameters first",
        );
      const realValue =
        parseProgramStatement(value.expression, stack, chunks, result) ?? [];
      if (realValue.length === 0)
        throw new Error(
          "Function has no output, call it instead of passing it as an argument",
        );
      realValue.forEach((wireValue, outputIndex) => {
        if (
          !(
            FanScriptBlocks[funcName].arguments.length >
            index + skips + outputIndex
          )
        )
          return;
        const currentArgumentType =
          FanScriptBlocks[funcName].arguments[index + skips + outputIndex];
        if (currentArgumentType.type === ArgumentTypes.Wire) {
          if (currentArgumentType.callback)
            throw new Error("Cannot assign wires to callbacks");
          wires.push({
            position: [
              [0, wireValue.blockY, 0],
              [0, result.blocks.length, 0],
            ],
            offset: [wireValue.offset, currentArgumentType.offset],
          });
        } else throw new Error("Cannot assign wires to parameters");
      });
      skips += realValue.length - 1;
    });
    wires.forEach((value) => (value.position[1][1] = result.blocks.length));
    myExpression.arguments.forEach((value, index) => {
      if (ts.isSpreadElement(value)) return;
      const argumentType = FanScriptBlocks[funcName].arguments[index + skips];
      if (!argumentType) throw new Error("Argument out of index");
      if (argumentType.type === ArgumentTypes.Wire && argumentType.callback) {
        callbacks.push({ argumentType: argumentType, expression: value });
        return;
      }
      const realValue = valueSolver(
        value,
        stack.variableStack,
        stack.functionStack,
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
          offset: [realValue.offset, argumentType.offset],
        });
      }
    });
    const beforeOffset = FanScriptBlocks[funcName].beforeOffset;
    const afterOffset = FanScriptBlocks[funcName].afterOffset;
    if (beforeOffset && afterOffset)
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
            beforeOffset,
          ],
        });
        stack.afterStack[stack.afterStack.length - 1] = {
          blockY: result.blocks.length,
          offset: afterOffset,
        };
      } else {
        stack.afterStack.push({
          blockY: result.blocks.length,
          offset: afterOffset,
        });
      }
    result.blocks.push({
      id: FanScriptBlocks[funcName].blockId,
      name: funcName,
      wires,
      values,
    });
    const blockY = result.blocks.length - 1;
    callbacks.forEach((callback) => {
      if (ts.isIdentifier(callback.expression)) {
        if (callback.argumentType.type !== ArgumentTypes.Wire) return;
        if (!stack.functionStack[callback.expression.text])
          throw new Error("Only arrow function are assignable to callbacks");
        const callbackArgs =
          stack.functionStack[callback.expression.text].parameters;
        if (stack.functionStack[callback.expression.text].wiresStart > 0)
          throw new Error(
            "Cannot use a function with parameter arguments as a callback",
          );
        const outputWires = FanScriptBlocks[funcName].outputWires ?? [];
        if (callbackArgs.length > outputWires.length)
          throw new Error(
            "Not enought arguments are provided to the arrow function",
          );
        const variableStack: {
          [key: string]:
            | string
            | number
            | boolean
            | {
                blockY: number;
                offset: [number, number, number];
              };
        } = {};
        callbackArgs.forEach(
          (value, index) =>
            (variableStack[value] = {
              blockY,
              offset: outputWires[index],
            }),
        );
        stack.afterStack.push({ blockY, offset: callback.argumentType.offset });
        stack.functionStack[callback.expression.text].body.statements.forEach(
          (statement) => {
            if (ts.isReturnStatement(statement)) return;
            parseProgramStatement(
              statement,
              {
                ...stack,
                variableStack,
              },
              chunks,
              result,
            );
          },
        );
        stack.afterStack.pop();
      } else if (ts.isArrowFunction(callback.expression)) {
        if (callback.argumentType.type !== ArgumentTypes.Wire) return;
        const callbackArgs = callback.expression.parameters.map(
          (parameter, index) => {
            if (!ts.isIdentifier(parameter.name))
              throw new Error("Can only use a solid name for arguments");
            if (parameter.type)
              throw new Error(
                "Please do not use types for direct arrow function declaration",
              );
            if ((FanScriptBlocks[funcName].outputWires?.length ?? 0) <= index)
              throw new Error("Do not assign more parameters than available");
            return parameter.name.text;
          },
        );
        const outputWires = FanScriptBlocks[funcName].outputWires ?? [];
        const variableStack: {
          [key: string]:
            | string
            | number
            | boolean
            | {
                blockY: number;
                offset: [number, number, number];
              };
        } = { ...stack.variableStack };
        callbackArgs.forEach(
          (value, index) =>
            (variableStack[value] = {
              blockY,
              offset: outputWires[index],
            }),
        );
        stack.afterStack.push({ blockY, offset: callback.argumentType.offset });
        if (!ts.isBlock(callback.expression.body))
          throw new Error("Please put your callback inside of curly brackets");
        callback.expression.body.statements.forEach((statement) => {
          if (ts.isReturnStatement(statement))
            throw new Error(
              "Please remove the return from the directly declared arrow function as it does nothing",
            );
          parseProgramStatement(
            statement,
            {
              ...stack,
              variableStack,
            },
            chunks,
            result,
          );
        });
        stack.afterStack.pop();
      } else {
        throw new Error("Only arrow function are assignable to callbacks");
      }
    });
    return FanScriptBlocks[funcName].outputWires?.map((vec) => ({
      blockY,
      offset: vec,
    }));
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
      ) {
        throw new Error(
          "Cannot assign function calls to anything other than arrays.",
        );
      }
      if (
        !ts.isCallExpression(child.initializer) &&
        ts.isArrayBindingPattern(child.name)
      )
        throw new Error("Can only assign function calls to arrays.");
      if (
        ts.isCallExpression(child.initializer) &&
        ts.isArrayBindingPattern(child.name)
      ) {
        const outputWires =
          parseProgramStatement(child.initializer, stack, chunks, result) ?? [];
        child.name.elements.forEach((element, elementIndex) => {
          if (!ts.isBindingElement(element))
            throw new Error(
              "Function calls are only assignable to simple arrays.",
            );
          if (!ts.isIdentifier(element.name))
            throw new Error(
              "Function calls are only assignable to name arrays.",
            );
          if (!(elementIndex < outputWires.length))
            throw new Error("Argument out of index.");
          stack.variableStack[element.name.text] = {
            blockY: outputWires[elementIndex].blockY,
            offset: outputWires[elementIndex].offset,
          };
        });
      } else if (ts.isIdentifier(child.name)) {
        if (ts.isArrowFunction(child.initializer)) {
          const parameters: string[] = [];
          let wiresStart = 0;
          child.initializer.parameters.forEach((parameter) => {
            if (!parameter.type)
              throw new Error("Types assignment is required for functions.");
            let type = "";
            if (ts.isTypeReferenceNode(parameter.type)) {
              if (!ts.isIdentifier(parameter.type.typeName))
                throw new Error("Only single type referencing is valid.");
              if (!FanScript.scriptTypes.includes(parameter.type.typeName.text))
                throw new Error(
                  `Only valid types are "${FanScript.scriptTypes.join(
                    '", "',
                  )}"`,
                );
              type = parameter.type.typeName.text;
            } else if (
              parameter.type.kind === ts.SyntaxKind.StringKeyword ||
              parameter.type.kind === ts.SyntaxKind.NumberKeyword ||
              parameter.type.kind === ts.SyntaxKind.BooleanKeyword
            ) {
              if (parameter.questionToken)
                throw new Error(
                  "Cannot assign optional parametes to arrow functions",
                );
              type =
                parameter.type.kind === ts.SyntaxKind.StringKeyword
                  ? "string"
                  : parameter.type.kind === ts.SyntaxKind.NumberKeyword
                    ? "number"
                    : parameter.type.kind === ts.SyntaxKind.BooleanKeyword
                      ? "boolean"
                      : "";
              if (wiresStart < parameters.length)
                throw new Error(
                  "Parameters are always before wires in function arguments",
                );
              wiresStart++;
            } else {
              throw new Error("Wrong type refrencing method.");
            }
            if (!FanScript.scriptTypes.includes(type))
              throw new Error(
                `Only valid types are "${FanScript.scriptTypes.join('", "')}"`,
              );
            if (!ts.isIdentifier(parameter.name))
              throw new Error("parameters can only be a name");
            parameters.push(parameter.name.text);
          });
          if (!ts.isBlock(child.initializer.body))
            throw new Error(
              "Only block initializer is possible for arrow function",
            );
          // if (child.initializer.type)
          //   throw new Error("Do not use return types for functions")
          stack.functionStack[child.name.text] = {
            body: child.initializer.body,
            parameters,
            wiresStart,
          };
        } else {
          stack.variableStack[child.name.text] = valueSolver(
            child.initializer,
            stack.variableStack,
            stack.functionStack,
          );
        }
      }
    });
  } else if (ts.isIfStatement(statement)) {
    if (ts.isCallExpression(statement.expression))
      throw new Error("Do not call functions as if condition");
    const realValue = valueSolver(
      statement.expression,
      stack.variableStack,
      stack.functionStack,
    );
    if (typeof realValue === "boolean")
      throw new Error(
        "Cannot use literal boolean in an if statement; please use Boolean/Truth wire instead.",
      );
    if (typeof realValue === "number" || typeof realValue === "string")
      throw new Error("The if block only works with wires!");
    const ifBlock = FanScriptBlocks["if"];
    if (!ifBlock) return;
    const beforeOffset = ifBlock.beforeOffset ?? [3, 1, 14];
    const blockY = result.blocks.length;
    const truthWire =
      ifBlock.arguments[0].type === ArgumentTypes.Wire
        ? ifBlock.arguments[0].offset ??
          ([0, 1, 11] as [number, number, number])
        : ([0, 1, 11] as [number, number, number]);
    const wires: {
      position: [[number, number, number], [number, number, number]];
      offset: [[number, number, number], [number, number, number]];
    }[] = [
      {
        position: [
          [0, realValue.blockY, 0],
          [0, blockY, 0],
        ],
        offset: [realValue.offset, truthWire],
      },
      {
        position: [
          stack.afterStack[stack.afterStack.length - 1].blockY === 32769
            ? [32769, 32769, 32769]
            : [0, stack.afterStack[stack.afterStack.length - 1].blockY, 0],
          [0, result.blocks.length, 0],
        ],
        offset: [
          stack.afterStack[stack.afterStack.length - 1].offset,
          beforeOffset,
        ],
      },
    ];
    const trueWire =
      ifBlock.arguments[1].type === ArgumentTypes.Wire
        ? ifBlock.arguments[1].offset ??
          ([14, 1, 11] as [number, number, number])
        : ([14, 1, 11] as [number, number, number]);
    const falseWire =
      ifBlock.arguments[2].type === ArgumentTypes.Wire
        ? ifBlock.arguments[2].offset ??
          ([14, 1, 3] as [number, number, number])
        : ([14, 1, 3] as [number, number, number]);
    result.blocks.push({
      id: ifBlock.blockId,
      name: "if",
      wires,
      values: [],
    });

    stack.afterStack.push({
      blockY: blockY,
      offset: trueWire,
    });
    const tempVariableStack = { ...stack.variableStack };
    if (ts.isBlock(statement.thenStatement))
      statement.thenStatement.statements.forEach((value) =>
        parseProgramStatement(
          value,
          { ...stack, variableStack: tempVariableStack },
          chunks,
          result,
        ),
      );
    else parseProgramStatement(statement.thenStatement, stack, chunks, result);
    stack.afterStack.pop();

    if (!statement.elseStatement) return;

    stack.afterStack.push({
      blockY: blockY,
      offset: falseWire,
    });
    const tempElseVariableStack = { ...stack.variableStack };
    if (ts.isBlock(statement.elseStatement))
      statement.elseStatement.statements.forEach((value) =>
        parseProgramStatement(
          value,
          { ...stack, variableStack: tempElseVariableStack },
          chunks,
          result,
        ),
      );
    else parseProgramStatement(statement.elseStatement, stack, chunks, result);
    stack.afterStack.pop();
  }
}

export function parse(script: string, chunks: Chunk.Data[]): FanScript.Result {
  const scriptObject = ts.createSourceFile(
    "x.ts",
    script,
    ts.ScriptTarget.Latest,
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
  const functionStack: {
    [key: string]: {
      body: ts.Block;
      parameters: string[];
      wiresStart: number;
    };
  } = {};
  const result: FanScript.Result = {
    originalScript: script,
    scriptName: "ScriptBlock",
    blocks: [],
    newBlocks: [],
  };
  scriptObject.statements.forEach((item, index, statementsArray) => {
    if (
      ts.isExpressionStatement(item) &&
      ts.isStringLiteral(item.expression) &&
      index === 0
    ) {
      result.scriptName = item.expression.text;
      return;
    }
    parseProgramStatement(
      item,
      { afterStack, beforeStack, variableStack, functionStack },
      chunks,
      result,
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
  return result;
}

export function fancadeResult(
  result: FanScript.Result,
  chunks: Chunk.Data[],
  uuid: string,
): (Chunk.Data & { type: Chunk.Type.Script; offset: [0, 0, 0] })[] {
  const arr: (Chunk.Data & { type: Chunk.Type.Script; offset: [0, 0, 0] })[] =
    [];
  const objWires: { [key: number]: [number, number, number] } = {};
  result.blocks.forEach((block, index, blocksArray) => {
    if (index === 0) {
      arr.push({
        uuid: uuid,
        type: Chunk.Type.Script,
        offset: [0, 0, 0],
        name: result.scriptName,
        locked: false,
        blocks: JSON.parse(
          JSON.stringify(
            new Array(4).fill(new Array(blocksArray.length).fill(new Array(4))),
          ),
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
    if (block.id === 0) return;
    if (
      typeof block.id === "number" &&
      Object.values(SelectableParameters["Blocks"]).includes(block.id)
    ) {
      myChunk.blocks[0][index][0] = block.id;
      if (block.id === SelectableParameters["Blocks"]["ARCH"])
        myChunk.blocks[0][index + 1][0] = block.id + 1;
    } else if (typeof block.id === "string") {
      const onlyChunks = chunks.filter((item) => item.uuid === block.id);
      if (onlyChunks.length === 0)
        throw new Error(`cannot handle uuid "${block.id}"`);
      const blockChunk = onlyChunks[0];
      const height = Math.max(
        blockChunk.offset ? blockChunk.offset[1] : 0,
        ...(blockChunk.children
          ? blockChunk.children.map((child) => child.offset[1])
          : []),
      );
      for (let i = 0; i <= height; i++)
        for (let x = 0; x < 4; x++)
          for (let z = 0; z < 4; z++) {
            if (!myChunk.blocks[x]) myChunk.blocks[x] = [];
            if (!myChunk.blocks[x][index + i])
              myChunk.blocks[x][index + i] = [];
            myChunk.blocks[x][index + i][z] = 0;
          }
      if (
        blockChunk.offset &&
        !(
          blockChunk.offset[0] === 0 &&
          blockChunk.offset[1] === 0 &&
          blockChunk.offset[2] === 0
        )
      ) {
        if (!myChunk.blocks[blockChunk.offset[0]][index + blockChunk.offset[1]])
          myChunk.blocks[blockChunk.offset[0]][index + blockChunk.offset[1]] =
            [];
        myChunk.blocks[blockChunk.offset[0]][index + blockChunk.offset[1]][
          blockChunk.offset[2]
        ] = block.id;
        objWires[index] = blockChunk.offset;
      } else {
        myChunk.blocks[0][index][0] = block.id;
      }
      if (blockChunk.children)
        blockChunk.children.forEach((item) => {
          if (!myChunk.blocks[item.offset[0]][index + item.offset[1]])
            myChunk.blocks[item.offset[0]][index + item.offset[1]] = [];
          myChunk.blocks[item.offset[0]][index + item.offset[1]][
            item.offset[2]
          ] = item.uuid;
        });
    } else {
      myChunk.blocks[0][index][0] = block.id;
      FanScriptBlocks[block.name].children.forEach((child) => {
        myChunk.blocks[child.offset[0]][index][child.offset[2]] = child.blockId;
      });
      myChunk.wires.push(
        ...block.wires.map((wire) =>
          wire.position[0][0] === 0 &&
          wire.position[0][2] === 0 &&
          objWires[wire.position[0][1]]
            ? {
                position: [objWires[wire.position[0][1]], wire.position[1]] as [
                  [number, number, number],
                  [number, number, number],
                ],
                offset: wire.offset,
              }
            : wire,
        ),
      );
      myChunk.values.push(...block.values);
    }
  });

  return arr;
}
