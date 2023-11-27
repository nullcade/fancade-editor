import { Game } from "custom_modules/GameFormat";
import React from "react";
import Editor from "@monaco-editor/react";

function ScriptTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language="typescript"
      defaultValue={"onTouch(Touching.Begins,Count.First,()=>{\n\twin();\n});"}
      beforeMount={(monaco) => {
        monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
          noLib: true,
        });
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare interface NumWire {}
          declare interface VecWire {}
          declare interface BoolWire {}
          declare interface RotWire {}
          declare interface ObjWire {}
          declare interface ConWire {}
          
          declare function win(): void;
          declare function lose(): void;
          
          declare enum Touching {
            Touching = 'touching',
            Begins = 'begins',
            Ends = 'ends',
          }
          declare enum Count {
            First = "first",
            Second = "second",
            Third = "third",
          }
          
          declare function onTouch(
            touching: Touching,
            count: Count,
            callback: (screenX: NumWire, screenY: NumWire) => void
          ): [NumWire, NumWire];
          `,
          "fanscript.d.ts"
        );
      }}
    />
  );
}

export default ScriptTab;
