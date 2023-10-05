import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import React, { useRef, useState } from 'react'

function InfoTab() {
    const unstable = useRef<HTMLInputElement>(null);
    const [advanced, setAdvanced] = useState<boolean>(false);
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
                placeholder="New Game"
                variant="standard"
                onInput={(e) => {
                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.slice(
                        0, Math.min((e.target as HTMLInputElement).value.length, unstable.current?.checked ? 255 : 16)
                    )
                }}
            />
            <TextField
                label="Author"
                placeholder="Unknown Author"
                variant="standard"
                onInput={(e) => {
                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.slice(
                        0, Math.min((e.target as HTMLInputElement).value.length, unstable.current?.checked ? 255 : 16)
                    )
                }}
            />
            <FormControlLabel control={<Checkbox />} label="Locked" />
            <FormControlLabel control={<Checkbox inputRef={unstable} />} label="Unstable" />
            <TextField
                label="Description"
                placeholder="A Fancade Game"
                multiline
                variant="standard"
                rows={4}
                onInput={(e) => {
                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.slice(
                        0, Math.min((e.target as HTMLInputElement).value.length, unstable.current?.checked ? 255 : 132)
                    )
                }}
                sx={{
                    flexGrow: 5,
                    width: '100%'
                }}
            />
            <FormControlLabel control={<Checkbox onChange={(e)=>{
                setAdvanced((e.target as HTMLInputElement).checked);
            }} style={{
                marginLeft: '.75rem'
            }} />} label="Advanced" />
            <TextField
                label="App Version"
                type="number"
                variant="standard"
                sx={{
                    display: advanced ? 'unset' : 'none'
                }}
                required={advanced}
            />
            <TextField
                label="ID Offset"
                type="number"
                variant="standard"
                sx={{
                    display: advanced ? 'unset' : 'none'
                }}
                required={advanced}
            />
        </div>
    )
}

export default InfoTab;