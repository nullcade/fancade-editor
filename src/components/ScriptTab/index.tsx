import { Game } from "custom_modules/GameFormat";
import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Monaco from "monaco-editor";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { ConstructionRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { parse, fancadeResult } from "custom_modules/FanScript";
import FanScript from "../../custom_modules/FanScript/fanscript.dts?raw";

function ScriptTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const script = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco.editor | null>(null);
  const [building, setBuilding] = useState<boolean>(false);
  const [buildable, setBuildable] = useState<boolean>(false);
  const [builded, setBuilded] = useState<boolean>(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const dialogTitle = useRef<string>("");
  const dialogBody = useRef<string>("");
  return (
    <Stack height="100%" flexDirection="column" flexWrap="nowrap">
      <Dialog
        open={errorDialogOpen}
        keepMounted
        onClose={() => setErrorDialogOpen(false)}
      >
        <DialogTitle>{dialogTitle.current}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogBody.current}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Stack
        flexDirection="row"
        flexWrap="nowrap"
        paddingX=".5rem"
        paddingTop=".5rem"
      >
        <LoadingButton variant="outlined">Save</LoadingButton>
        <LoadingButton
          variant="outlined"
          loadingPosition="start"
          color={builded ? "success" : undefined}
          startIcon={<ConstructionRounded />}
          onClick={() => {
            if (building || script.current === null) return;
            setBuilding(true);
            try {
              const parsed = parse(script.current.getValue(), game.chunks);
              game.chunks.push(...fancadeResult(parsed, game.chunks));
            } catch (error) {
              dialogTitle.current = "Compilation Error";
              dialogBody.current = (error as Error).message;
              setErrorDialogOpen(true);
            }
            setBuilding(false);
            setBuilded(true);
            setTimeout(() => setBuilded(false), 1000);
          }}
          disabled={!buildable || building}
          loading={building}
        >
          Build
        </LoadingButton>
      </Stack>
      <Editor
        height="100%"
        theme="vs-dark"
        language="typescript"
        defaultValue={
          "onTouch(Touching.Begins, Count.First, () => {\n\twin();\n});"
        }
        options={{
          fontFamily: "JetBrainsMono-Regular",
          fontLigatures: true,
        }}
        onMount={(value, monaco) => {
          script.current = value;
          monacoRef.current = monaco.editor;
          setBuildable(
            monaco.editor.getModelMarkers({ owner: "typescript" }).length === 0
          );
        }}
        onChange={() => {
          setBuildable(true);
        }}
        onValidate={() =>
          setBuildable(
            (monacoRef.current?.getModelMarkers({ owner: "typescript" })
              .length ?? 1) === 0
          )
        }
        beforeMount={(monaco) => {
          monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
            true
          );
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
            // noLib: true,
            lib: ["es2015.iterable"],
          });
          monaco.editor.EditorOptions.fontFamily.applyUpdate(
            "JetBrainsMono-Regular",
            "JetBrainsMono-Regular"
          );
          fetch(FanScript).then((response) =>
            response
              .text()
              .then((fileContent) =>
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  fileContent,
                  "FanScript.d.ts"
                )
              )
          );
        }}
      />
    </Stack>
  );
}

export default ScriptTab;
