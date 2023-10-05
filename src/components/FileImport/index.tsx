import React, { useRef } from 'react';
import zlib from 'zlib';
// import { FileConsumer } from '../../contexts/fileContext';
import { Button } from '@mui/material';
import PublishIcon from '@mui/icons-material/PublishRounded';
import { GameDecoder, Game } from '../../custom_modules/GameFormat';

function FileImport({ setFile }: {
    setFile: React.Dispatch<React.SetStateAction<Game.Data>>
}) {
    const inputFile = useRef<HTMLInputElement>(null);
    const onButtonClick = () => {
        if (inputFile.current)
            inputFile.current.click();
    };
    const onFileChange = async () => {
        if (inputFile.current?.files)
            setFile(new GameDecoder(zlib.inflateSync(
                Buffer.from(
                    await inputFile.current?.files[0].arrayBuffer()
                )
            )).decGame());
    }
    return (
        <Button variant="contained" size='large' startIcon={<PublishIcon />} onClick={onButtonClick} sx={{
            height: 'auto',
            borderRadius: '40px',
            paddingX: '15px',
            fontWeight: '600'
        }}>
            <input type='file' id='file' ref={inputFile} onChange={onFileChange} style={{ display: 'none' }} />
            Import
        </Button>
    )
}

export default FileImport