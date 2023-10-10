import React, { memo } from 'react';
import { ChunksOptimised } from '.';
import { Checkbox, IconButton, ListItem, TextField } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LockOpen from '@mui/icons-material/LockOpen';
import Lock from '@mui/icons-material/Lock';

function ChunkListItem({value, selected, select}: {
    value: ChunksOptimised, selected: boolean, select: () => void
}) {
  return (
    <ListItem sx={{
        borderRadius: 'inherit',
        bgcolor: '#28292a',
        display: 'flex',
        flexDirection: 'row',
        wrap: 'wrap'
    }} secondaryAction={
        value.subChunks ?
        <IconButton edge="end" aria-label="comments"
            onClick={select}
        >
            {selected ? <ExpandLess /> : <ExpandMore />}
        </IconButton> : undefined
    }>
        <TextField label='Name' defaultValue={value.name} />
        <Checkbox defaultChecked={value.locked} icon={<LockOpen />} checkedIcon={<Lock />} />
    </ListItem>
  )
}

export default memo(ChunkListItem, (prevProps, newProps) => {
    if(prevProps.value !== newProps.value) return false;
    if(prevProps.selected !== newProps.selected) return false;
    return true;
});