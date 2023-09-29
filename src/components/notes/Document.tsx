import { KeyboardEventHandler, useState } from 'react';
import { BlockData, Direction, NoteBlockData } from '../../data/notes';
import { KeyedArray, addKey } from '../../data/keys';
import { ControlledComponentProps } from '../../data/props';
import { ArrayMap } from '@tater-archives/react-array-utils';
import Block from './Block';
import { useHistory } from '../../useHistory';

function Document({
    value,
    onChange,
}: ControlledComponentProps<KeyedArray<BlockData>>) {
    const [focused, setFocused] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    const [undo, redo] = useHistory(value, onChange);

    const handleKeyDown: KeyboardEventHandler = event => {
        if (!event.ctrlKey) return;
        switch (event.key) {
            case 'z':
                undo();
                break;
            case 'y':
                redo();
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    return (
        <div onKeyDown={handleKeyDown}>
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
                                    addKey(NoteBlockData('', block.indent))
                                );
                                setFocused([index + 1, 'top']);
                            }}
                            onDeleteOut={() => {
                                if (value.length <= 1) return;
                                remove();
                                setFocused([index - 1, 'bottom']);
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
        </div>
    );
}

export default Document;
