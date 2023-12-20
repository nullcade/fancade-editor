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
import {
  ConstructionRounded,
  LocalParkingRounded,
  SaveRounded,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { parse, fancadeResult } from "custom_modules/FanScript";
import FanScript from "../../custom_modules/FanScript/fanscript.dts?raw";
import { nanoid } from "nanoid";
import * as prettier from "prettier/standalone";
import * as parserTs from "prettier/parser-typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";

function ScriptTab({
  game,
  setGame,
}: {
  game: Game.Data;
  setGame: React.Dispatch<React.SetStateAction<Game.Data>>;
}) {
  const script = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco.editor | null>(null);
  const [buildable, setBuildable] = useState<boolean>(false);
  const [building, setBuilding] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [formatting, setFormatting] = useState<boolean>(false);
  const [builded, setBuilded] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [formatted, setFormatted] = useState<boolean>(false);
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
        <LoadingButton
          variant="outlined"
          loadingPosition="start"
          color={saved ? "success" : undefined}
          startIcon={<SaveRounded />}
          onClick={() => {
            if (saving || script.current === null) return;
            setSaving(true);
            if (game.script)
              game.chunks = game.chunks.filter(
                (value) => !(value.uuid === game.script?.uuid),
              );
            game.script = {
              uuid: game.script?.uuid ?? nanoid(),
              code: script.current.getValue(),
            };
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
          }}
          loading={saving}
          disabled={script.current === null}
        >
          Save
        </LoadingButton>
        <LoadingButton
          variant="contained"
          loadingPosition="center"
          color={formatted ? "success" : undefined}
          onClick={async () => {
            if (formatting || script.current === null) return;
            setFormatting(true);
            const text = await prettier
              .format(script.current.getValue(), {
                parser: "typescript",
                plugins: [parserTs, prettierPluginEstree],
              });
            script.current?.setValue(text);
            setFormatting(false);
            setFormatted(true);
            setTimeout(() => setFormatted(false), 1000);
          }}
          sx={{
            aspectRatio: "1/1",
            minWidth: "auto",
            maxWidth: "fit-content",
            padding: "6px",
          }}
          loading={saving}
          disabled={script.current === null}
        >
          <LocalParkingRounded />
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          loadingPosition="start"
          color={builded ? "success" : undefined}
          startIcon={<ConstructionRounded />}
          onClick={() => {
            if (building || script.current === null) return;
            setBuilding(true);
            setSaving(true);
            if (game.script)
              game.chunks = game.chunks.filter(
                (value) => !(value.uuid === game.script?.uuid),
              );
            game.script = {
              uuid: game.script?.uuid ?? nanoid(),
              code: script.current.getValue(),
            };
            try {
              const parsed = parse(game.script.code, game.chunks);
              game.chunks.push(
                ...fancadeResult(parsed, game.chunks, game.script.uuid),
              );
            } catch (error) {
              dialogTitle.current = "Compilation Error";
              dialogBody.current = (error as Error).message;
              setErrorDialogOpen(true);
            }
            setBuilding(false);
            setSaving(false);
            setBuilded(true);
            setSaved(true);
            setTimeout(() => {
              setBuilded(false);
              setSaved(false);
            }, 1000);
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
          game.script?.code ??
          '"Touch To Win";\n\nonTouch(Touching.Begins, Count.First, () => {\n\twin();\n});'
        }
        options={{
          fontFamily: "JetBrainsMono-Regular",
          fontLigatures: true,
        }}
        onMount={(value, monaco) => {
          script.current = value;
          monacoRef.current = monaco.editor;
          setBuildable(
            monaco.editor.getModelMarkers({ owner: "typescript" }).length === 0,
          );
        }}
        onChange={() => {
          setBuildable(true);
        }}
        onValidate={() =>
          setBuildable(
            (monacoRef.current?.getModelMarkers({ owner: "typescript" })
              .length ?? 1) === 0,
          )
        }
        beforeMount={(monaco) => {
          monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
            true,
          );
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
            // noLib: true,
            lib: ["es2015.iterable"],
          });
          monaco.editor.EditorOptions.fontFamily.applyUpdate(
            "JetBrainsMono-Regular",
            "JetBrainsMono-Regular",
          );
          fetch(FanScript).then((response) =>
            response
              .text()
              .then((fileContent) =>
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  fileContent,
                  "FanScript.d.ts",
                ),
              ),
          );
        }}
      />
    </Stack>
  );
}

export default ScriptTab;
