import React, { useEffect, useRef, useState } from 'react'
import { Game, Chunk, Value, Wire, Color, Vec } from '../../custom_modules/GameFormat';
import { List, ListItem, TextField, Checkbox, Select } from '@mui/material';
import { Lock, LockOpen } from "@mui/icons-material"

interface ChunksOptimised {
    type: 0 | 1 | 2 | 3,
    name: string,
    locked: boolean,
    blocks: Chunk.Blocks,
    values: Value.Data[],
    wires: Wire.Data[],
    id?: number,

    color?: Color.Id,

    faces?: Chunk.Faces,
    collider?: Chunk.Collider,

    subChunks?: {
        offset: Vec,
        blocks: Chunk.Blocks,
        values: Value.Data[],
        wires: Wire.Data[],

        faces?: Chunk.Faces
    }[]
}

function ChunksTab({
    game,
    setGame,
    active
}: { game: Game.Data, setGame: React.Dispatch<React.SetStateAction<Game.Data>>, active: boolean }) {
    let [cachedChunks, setCachedChunks] = useState<Chunk.Data[]>([]);

    const [lastActive, setLastActive] = useState<boolean>(active);
    useEffect(() => { setTimeout(() => setLastActive(active), 1000) }, [active]);

    const unstable = useRef<HTMLInputElement>(null);
    const [chunks, setChunks] = useState<ChunksOptimised[]>([]);

    const [selectedItem, setSelectedItem] = useState<number>(-1);

    useEffect(() => {
        if (cachedChunks === game.chunks) return;
        setSelectedItem(-1);
        setChunks([]);
        setCachedChunks(game.chunks);
    }, [game])

    useEffect(() => {
        let chunksOptimised: ChunksOptimised[] = [];
        let remainingChunks = game.chunks.filter((value) => {
            if (value.name)
                chunksOptimised.push({
                    type: value.type ?? 0,
                    name: value.name,
                    locked: value.locked ?? false,
                    blocks: value.blocks ?? ([[[]]]),
                    values: value.values ?? [],
                    wires: value.wires ?? [],
                    id: value.id ?? (chunksOptimised.at(-1)?.id ?? game.idOffset) + 1,

                    color: value.color,

                    faces: value.faces,
                    collider: value.collider,

                    subChunks: (value.id && value.name) ? [] : undefined
                })
            return !value.name;
        });
        chunksOptimised.map(value => {
            if (value.id)
                remainingChunks = remainingChunks.filter(val => {
                    if (val.id === value.id) {
                        if (!value.subChunks)
                            value.subChunks = [];
                        value.subChunks.push({
                            offset: val.offset ?? [0, 0, 0],
                            blocks: val.blocks ?? [],
                            values: val.values ?? [],
                            wires: val.wires ?? [],
                            faces: val.faces
                        });
                        return false;
                    }
                    return true;
                });
            return value;
        })
        console.log(chunksOptimised);
        setChunks(chunksOptimised);
    }, [cachedChunks]);

    const unoptimiseChunks = (): Chunk.Data[] => {
        let newChunks: Chunk.Data[] = [];
        chunks.forEach(value => {
            newChunks.push({
                type: value.type,
                name: value.name,
                id: value.id,
                locked: value.locked,
                collider: value.collider,
                color: value.color,
                faces: value.faces,
                blocks: value.blocks,
                values: value.values,
                wires: value.wires
            })
            if (value.subChunks)
                value.subChunks.forEach(val => {
                    newChunks.push({
                        type: value.type,
                        id: value.id,
                        locked: value.locked,
                        collider: value.collider,
                        color: value.color,
                        faces: val.faces,
                        blocks: val.blocks,
                        values: val.values,
                        wires: val.wires,
                        offset: val.offset
                    })
                })
        })
        return newChunks;
    }

    return (
        <div style={{
            display: (lastActive || active) ? 'flex' : 'none',
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'start',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            width: '100%',
            height: '100%',
            opacity: (active && lastActive) ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(.4,0,.1,1)',
            borderRadius: '12px',
            // paddingLeft: '1rem',
            // paddingRight: '1rem'
        }}>
            <List
                sx={{
                    width: '100%',
                    // height: '2rem',
                    borderRadius: 'inherit',
                    marginLeft: '1rem',
                    marginRight: '1rem',
                    gap: '4px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {
                    chunks.map((value, index) =>
                        <ListItem key={index} sx={{
                            borderRadius: 'inherit',
                            bgcolor: '#28292a',
                        }}>
                            <TextField label='Name' defaultValue={value.name} />
                            <TextField label='ID' defaultValue={value.id}
                              disabled style={{ marginLeft: '0.75rem', width: '5.5ch' }}
                            />
                            <Checkbox label='Locked' defaultValue={value.locked}
                              icon={<LockOpen />} checkedIcon={<Lock />} style={{ marginLeft: '0.75rem' }}
                            />
                        </ListItem>
                    )
                }
            </List>
        </div>
    )
}

export default ChunksTab
