import { KeyboardEventHandler, useState } from 'react';
import {
    BlockData,
    Direction,
    EmbedBlockData,
    NoteBlockData,
    TableBlockData,
} from '../../data/notes';
import { KeyedArray, addKey } from '../../data/keys';
import { ControlledComponentProps } from '../../data/props';
import { ArrayMap } from '@tater-archives/react-array-utils';
import Block from './Block';
import { AddIcon, DropdownIcon } from '../../icons';
import DropdownButton from '../DropdownButton';

const addOptions: [label: string, producer: () => BlockData][] = [
    ['Note', () => NoteBlockData('')],
    [
        'Table',
        () =>
            TableBlockData([
                ['', ''],
                ['', ''],
            ]),
    ],
    ['Embed', () => EmbedBlockData('https://')],
    ['Desmos', () => EmbedBlockData('https://desmos.com/calculator')],
    ['Desmos Geometry', () => EmbedBlockData('https://desmos.com/geometry')],
    ['Desmos 3D (Beta)', () => EmbedBlockData('https://desmos.com/3d')],
];

function Document({
    onUndo,
    onRedo,
    value,
    onChange,
}: ControlledComponentProps<KeyedArray<BlockData>> & {
    onUndo: () => void;
    onRedo: () => void;
}) {
    const [focused, setFocused] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    const handleKeyDown: KeyboardEventHandler = event => {
        if (!event.ctrlKey) return;
        switch (event.key) {
            case 'z':
                onUndo();
                break;
            case 'y':
                onRedo();
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    const addBlock = (block: BlockData) => {
        onChange([...value, addKey(block)]);
    };

    return (
        <div className='mb-16 mt-4' onKeyDown={handleKeyDown}>
            <ArrayMap array={value} setArray={onChange} keyProp='key'>
                {(
                    block,
                    { set, insertAfter, remove, replace },
                    index,
                    { splice }
                ) => {
                    return (
                        <Block
                            value={block}
                            onChange={set}
                            onIndent={change => {
                                // If indenting out
                                if (change === 1) {
                                    // You cannot indent block 0
                                    if (index === 0) {
                                        return;
                                    }
                                    // Go backwards through the array starting from the current block
                                    for (const { indent } of value
                                        .slice(0, index)
                                        .reverse()) {
                                        // if the block is indented less, we cannot indent
                                        if (indent < block.indent) {
                                            return;
                                            // if the block is indented the same, we can indent
                                        } else if (indent === block.indent) {
                                            break;
                                        } // otherwise keep searching
                                    }
                                }
                                const nonChildIndex = value
                                    .slice(index + 1)
                                    .findIndex(e => e.indent <= block.indent);
                                const childCount =
                                    nonChildIndex === -1
                                        ? value.length - index - 1
                                        : nonChildIndex;

                                splice(
                                    index,
                                    childCount + 1,
                                    value
                                        .slice(index, index + childCount + 1)
                                        .map(e => ({
                                            ...e,
                                            indent: e.indent + change,
                                        }))
                                );
                            }}
                            onDownOut={() =>
                                index < value.length - 1 &&
                                setFocused([index + 1, 'top'])
                            }
                            onUpOut={() =>
                                index > 0 && setFocused([index - 1, 'bottom'])
                            }
                            onInsertAfter={() => {
                                insertAfter(
                                    addKey(
                                        NoteBlockData(
                                            '',
                                            // If the next block is a child of this one, make the new block also a child
                                            value[index + 1]?.indent >
                                                block.indent
                                                ? block.indent + 1
                                                : block.indent
                                        )
                                    )
                                );
                                setFocused([index + 1, 'top']);
                            }}
                            onDeleteOut={() => {
                                if (value.length <= 1) return;
                                remove();
                                if (index === 0) {
                                    setFocused([index, 'top']);
                                } else {
                                    setFocused([index - 1, 'bottom']);
                                }
                            }}
                            focused={index === focused?.[0]}
                            focusSide={
                                index === focused?.[0] ? focused[1] : undefined
                            }
                            onFocus={() => setFocused([index, undefined])}
                            onReplace={replace}
                        />
                    );
                }}
            </ArrayMap>
            <div className='relative flex flex-row justify-center gap-2px print:hidden'>
                <button
                    className='button rounded-l-md rounded-r-none p-1'
                    onClick={() => addBlock(NoteBlockData(''))}>
                    <AddIcon className='icon h-6 w-6' />
                </button>
                <DropdownButton
                    className='button rounded-l-none rounded-r-md p-0'
                    dropdownContent={
                        <div className='my-1 flex flex-col gap-2px'>
                            {addOptions.map(([label, provider], i) => (
                                <button
                                    key={i}
                                    className={`button w-auto px-2 py-1 text-left text-base ${
                                        i === 0
                                            ? 'rounded-b-none '
                                            : i === addOptions.length - 1
                                            ? 'rounded-t-none'
                                            : 'rounded-none'
                                    }`}
                                    onClick={() => addBlock(provider())}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    }>
                    <DropdownIcon className='icon h-5 w-5' />
                </DropdownButton>
            </div>
        </div>
    );
}

export default Document;
