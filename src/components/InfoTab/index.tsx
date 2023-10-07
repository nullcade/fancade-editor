import React, { useEffect, useRef, useState } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material';
import { Game } from '../../custom_modules/GameFormat';
import ControlledTextField from '../ControlledTextField';

function InfoTab({
    game,
    setGame,
    active
}: { game: Game.Data, setGame: React.Dispatch<React.SetStateAction<Game.Data>>, active: boolean }) {
    const unstable = useRef<HTMLInputElement>(null);
    const [advanced, setAdvanced] = useState<boolean>(false);
    const [lastActive, setLastActive] = useState<boolean>(active);
    useEffect(() => {setTimeout(() => setLastActive(active), 1000)}, [active]);
    
    return (
        <div style={{
            display: (lastActive || active) ? 'flex' : 'none',
            position: 'absolute',
            // top: 0,
            // bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '1rem',
            flexWrap: 'wrap',
            width: 'fit-content',
            height: '100%',
            opacity: (active && lastActive) ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(.4,0,.1,1)'
        }}>
            <ControlledTextField
                label="Title"
                value={game.title}
                placeholder="New Game"
                variant="standard"
                setValue={value => {
                    game.title = (value as string);
                    setGame(game);
                }}
                valueCheck={event => {
                    if ((new TextEncoder().encode(event.target.value as string)).length > (unstable.current?.checked ? 255 : 16))
                        return String.fromCharCode(...(new TextEncoder().encode(event.target.value as string).slice(0, unstable.current?.checked ? 255 : 16)));
                    return event.target.value;
                }}
            />
            <ControlledTextField
                label="Author"
                value={game.author}
                placeholder="Unknown Author"
                variant="standard"
                setValue={value => {
                    game.author = value as string;
                    setGame(game);
                }}
                valueCheck={event => {
                    if ((new TextEncoder().encode(event.target.value as string)).length > (unstable.current?.checked ? 255 : 16))
                        return String.fromCharCode(...(new TextEncoder().encode(event.target.value as string).slice(0, unstable.current?.checked ? 255 : 16)));
                    return event.target.value;
                }}
            />
            <FormControlLabel control={<Checkbox inputRef={unstable} />} label="Unstable" />
            <ControlledTextField
                label="Description"
                value={game.description}
                placeholder="A Fancade Game"
                multiline
                variant="standard"
                rows={4}
                setValue={value => {
                    game.description = value as string;
                    setGame(game);
                }}
                valueCheck={event => {
                    if ((new TextEncoder().encode(event.target.value as string)).length > (unstable.current?.checked ? 255 : 132))
                        return String.fromCharCode(...(new TextEncoder().encode(event.target.value as string).slice(0, unstable.current?.checked ? 255 : 132)));
                    return event.target.value;
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
            <ControlledTextField
                label="App Version"
                value={game.appVersion}
                type="number"
                variant="standard"
                setValue={value => {
                    game.appVersion = parseInt(value as string);
                    setGame(game);
                }}
                valueCheck={event => {
                    if (Number.isNaN(parseInt(event.target.value)) || parseInt(event.target.value) < 0)
                        return '0';
                    else if (parseInt(event.target.value) > 65535)
                        return '65535';
                    return event.target.value;
                }}
                sx={{
                    opacity: advanced ? 1 : 0,
                    transition: 'opacity 1s cubic-bezier(.4,0,.1,1)'
                }}
                disabled={!advanced}
                required={advanced}
            />
            <ControlledTextField
                label="ID Offset"
                value={game.idOffset}
                type="number"
                variant="standard"
                setValue={value => {
                    game.idOffset = parseInt(value as string);
                    setGame(game);
                }}
                valueCheck={event => {
                    if (Number.isNaN(parseInt(event.target.value)) || parseInt(event.target.value) < 0)
                        return '0';
                    else if (parseInt(event.target.value) > 65535)
                        return '65535';
                    return event.target.value;
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