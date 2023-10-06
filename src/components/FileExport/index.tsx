import React, { useContext } from 'react'
import zlib from 'zlib';
import FileDownloadIcon from '@mui/icons-material/FileDownloadRounded';
import { Button } from '@mui/material';
import { GameContext } from '../../contexts/gameContext';
import { GameEncoder, Game } from '../../custom_modules/GameFormat';
import { nanoid } from 'nanoid';

function FileExport() {
    const game = useContext(GameContext);
    const saveFile = async (blob: Game.Data, suggestedName: string) => {
        // Feature detection. The API needs to be supported
        // and the app not run in an iframe.
        const supportsFileSystemAccess =
            'showSaveFilePicker' in window &&
            (() => {
                try {
                    return window.self === window.top;
                } catch {
                    return false;
                }
            })();
        // If the File System Access API is supported…
        if (supportsFileSystemAccess) {
            try {
                // Show the file save dialog.
                const handle = await window.showSaveFilePicker({
                    suggestedName,
                    types: [
                        {
                            description: "Fancade game",
                            accept: { "application/octet-stream": [".fc"] },
                        }
                    ]
                });
                // Write the blob to the file.
                const writable = await handle.createWritable();
                await writable.write(
                    zlib.deflateSync(new GameEncoder(blob).encGame())
                );
                await writable.close();
                return;
            } catch (err) {
                // Fail silently if the user has simply canceled the dialog.
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error(err.name, err.message);
                }
                if (err instanceof Error && err.name === 'AbortError') return;
            }
        }
        // Fallback if the File System Access API is not supported…
        // Create the blob URL.
        const blobURL = URL.createObjectURL(new Blob([
            zlib.deflateSync(new GameEncoder(blob).encGame())
        ]));
        // Create the `<a download>` element and append it invisibly.
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = suggestedName;
        a.style.display = 'none';
        document.body.append(a);
        // Programmatically click the element.
        a.click();
        // Revoke the blob URL and remove the element.
        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
            a.remove();
        }, 1000);
    };
    return (
        <Button variant="contained" size='large' endIcon={<FileDownloadIcon />} onClick={
            () => {
                if (game)
                    saveFile(game, (game.title.length !== 0 ? game.title : nanoid(8)) + '.fc');
            }
        } sx={{
            height: 'auto',
            borderRadius: '40px',
            paddingX: '15px',
            fontWeight: '600'
        }}>
            Export
        </Button>
    )
}

export default FileExport