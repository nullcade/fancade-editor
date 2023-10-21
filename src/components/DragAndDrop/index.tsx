import { Box, CircularProgress } from '@mui/material'
import FileOpenRoundedIcon from '@mui/icons-material/FileOpenRounded';
import { GameDecoder, Game } from "custom_modules/GameFormat";
import zlib from "pako";
import { Buffer } from "buffer";
import React, { useState, useEffect } from 'react'

function DragAndDrop({
    setFile
}: {
    setFile: React.Dispatch<React.SetStateAction<Game.Data>>
}) {
    const [opacity, setOpacity] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<number>(0);
    useEffect(() => {
        const root = document.getElementById('root');
        root?.addEventListener('click', event => {
            if (error) {
                setError(0);
                setOpacity(0);
            }
        })
        root?.addEventListener('dragover', event => {
            if (event.dataTransfer?.types.includes('Files') && !loading) {
                event.preventDefault();
                setError(0);
                setOpacity(1);
            }
        })
        root?.addEventListener('dragleave', event => {
            if (event.dataTransfer?.types.includes('Files') && !loading) {
                event.preventDefault();
                setError(0);
                setOpacity(0);
            }
        })
        root?.addEventListener('drop', async event => {
            event.preventDefault();
            if (event.dataTransfer?.types.includes('Files') && !loading) {
                if (event.dataTransfer.files.length > 1) {
                    setError(1);
                    return;
                } else if (event.dataTransfer.files.length === 0) {
                    setError(2);
                    return;
                }
                setLoading(true);
                try {
                    setFile(
                        new GameDecoder(
                            Buffer.from(
                                zlib.inflate(await event.dataTransfer.files[0].arrayBuffer()),
                            ),
                        ).decGame(),
                    )
                } catch (err) {
                    console.log(err)
                    setError(3);
                    return;
                }
                setTimeout(() => {
                    setOpacity(0);
                    setError(0);
                }, 2000);
                setError(-1);
                setLoading(false);
            }
        })
    })
    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                transition:
                    'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1), ' +
                    'backdrop-filter 225ms cubic-bezier(0.4, 0, 0.2, 1), ' +
                    'background-color 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: error === -1 ? 'rgba(0, 64, 0, 0.5)' : error ? 'rgba(64, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: opacity ? 'blur(5px)' : 'blur(0)',
                zIndex: "9999999999"
            }}
        >
            <FileOpenRoundedIcon sx={{
                fontSize: '6rem'
            }} />
            {
                loading ?
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        <CircularProgress size='2rem' />
                        <h3>Loading...</h3>
                    </Box>
                    : error === 1 ?
                        <h3>Please drop only one file.</h3>
                        : error === 2 ?
                            <h3>Please drop a file.</h3>
                            : error === 3 ?
                                <h3>Could not read the file.</h3>
                                :
                                error === -1 ?
                                    <h3>Succes!</h3>
                                    :
                                    <h3>Drop your fancade file here!</h3>
            }
        </Box>
    )
}

export default DragAndDrop