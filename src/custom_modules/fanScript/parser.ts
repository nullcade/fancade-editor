import { FanScript } from "./types";
import parser from "@typescript-eslint/parser";

export function parse(script: string): FanScript.Result | void {
  const scriptObject = parser.parse(script);
  console.log(scriptObject);
}
