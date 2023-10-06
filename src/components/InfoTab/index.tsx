import React, { useRef, useState } from 'react'
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Game } from '../../custom_modules/GameFormat';

function InfoTab({ game, setGame }: { game: Game.Data, setGame: React.Dispatch<React.SetStateAction<Game.Data>> }) {
    const unstable = useRef<HTMLInputElement>(null);
    const [advanced, setAdvanced] = useState<boolean>(false);
    const [lastInput, setLastInput] = useState<number>(0);

    const forceReload = () => {
        setLastInput(Date.now());
    }
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '1rem',
            flexWrap: 'wrap',
            width: 'fit-content',
            height: '100%'
        }}>
            <TextField
                label="Title"
                value={game.title}
                placeholder="New Game"
                variant="standard"
                onChange={e => {
                    game.title = e.target.value;
                    forceReload();
                    setGame(game);
                }}
            />
            <TextField
                label="Author"
                value={game.author}
                placeholder="Unknown Author"
                variant="standard"
                onChange={e => {
                    game.author = e.target.value;
                    forceReload();
                    setGame(game);
                }}
            />
            <FormControlLabel control={<Checkbox inputRef={unstable} />} label="Unstable" />
            <TextField
                label="Description"
                value={game.description}
                placeholder="A Fancade Game"
                multiline
                variant="standard"
                rows={4}
                onChange={e => {
                    game.description = e.target.value;
                    forceReload();
                    setGame(game);
                }}
                sx={{
                    flexGrow: 5,
                    width: '100%'
                }}
            />
            <FormControlLabel control={<Checkbox onChange={(e) => {
                setAdvanced((e.target as HTMLInputElement).checked);
            }} style={{
                marginLeft: '.75rem'
            }} />} label="Advanced" />
            <TextField
                label="App Version"
                value={game.appVersion}
                type="number"
                variant="standard"
                onChange={e => {
                    game.appVersion = parseInt(e.target.value);
                    forceReload();
                    setGame(game);
                }}
                sx={{
                    opacity: advanced ? 1 : 0,
                    transition: 'opacity 1s cubic-bezier(.4,0,.1,1)'
                }}
                disabled={!advanced}
                required={advanced}
            />
            <TextField
                label="ID Offset"
                value={game.idOffset}
                type="number"
                variant="standard"
                onChange={e => {
                    game.idOffset = parseInt(e.target.value);
                    forceReload();
                    setGame(game);
                }}
                sx={{
                    opacity: advanced ? 1 : 0,
                    transition: 'opacity 1s cubic-bezier(.4,0,.1,1)'
                }}
                disabled={!advanced}
                required={advanced}
            />
        </div>
    )
}

export default InfoTab;