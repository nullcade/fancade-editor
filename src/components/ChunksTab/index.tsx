import React, { useEffect, useRef, useState } from 'react'
import { Game, Chunk, Value, Wire, Color, Vec } from '../../custom_modules/GameFormat';

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
    const [lastActive, setLastActive] = useState<boolean>(active);
    useEffect(() => {setTimeout(() => setLastActive(active), 1000)}, [active]);
    
    const unstable = useRef<HTMLInputElement>(null);
    const [chunks, setChunks] = useState<ChunksOptimised[]>([]);

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
                    id: value.id,

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
    }, [game]);

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
            alignItems: 'center',
            justifyContent: 'start',
            gap: '1rem',
            flexWrap: 'wrap',
            width: 'fit-content',
            height: '100%',
            opacity: (active && lastActive) ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(.4,0,.1,1)'
        }}>
            
        </div>
    )
}

export default ChunksTab