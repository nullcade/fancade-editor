import React, { memo } from 'react';
import { ChunksOptimised } from '.';
import { IconButton, ListItem, TextField } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function ChunkListItem({value, selected, select}: {
    value: ChunksOptimised, selected: boolean, select: () => void
}) {
  return (
    <ListItem sx={{
        borderRadius: 'inherit',
        bgcolor: '#28292a'
    }} secondaryAction={
        value.subChunks ?
        <IconButton edge="end" aria-label="comments"
            onClick={select}
        >
            {selected ? <ExpandLess /> : <ExpandMore />}
        </IconButton> : undefined
    }>
        <TextField label='Name' defaultValue={value.name} />
    </ListItem>
  )
}

export default memo(ChunkListItem, (prevProps, newProps) => {
    if(prevProps.value !== newProps.value) return false;
    if(prevProps.selected !== newProps.selected) return false;
    return true;
});