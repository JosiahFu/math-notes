import { useState } from 'react';
import {
    Block,
    ControlledComponentProps,
    Direction,
    FocusProps,
    KeyedArray,
    NavigationHandlers,
    NoteBlockData,
    addKey,
} from '../data';
import { ArrayMap } from '@tater-archives/react-array-utils';
import NoteBlock from './NoteBlock';
import TableBlock from './TableBlock';

function Block() {}

function Document({
    value,
    onChange,
}: ControlledComponentProps<KeyedArray<Block>>) {
    const [focused, setFocused] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    return (
        <ArrayMap array={value} setArray={onChange} keyProp='key'>
            {(block, { set, insertAfter, remove, replace }, index) => {
                const props: NavigationHandlers & FocusProps = {
                    onDownOut: () =>
                        index < value.length - 1 &&
                        setFocused([index + 1, 'top']),
                    onUpOut: () =>
                        index > 0 && setFocused([index - 1, 'bottom']),
                    onInsertAfter: () => {
                        insertAfter(addKey(NoteBlockData('')));
                        setFocused([index + 1, 'top']);
                    },
                    onDelete: () => {
                        remove();
                        setFocused([index - 1, 'bottom']);
                    },
                    focused: index === focused?.[0],
                    focusSide: index === focused?.[0] ? focused[1] : undefined,
                    onFocus: () => setFocused([index, undefined]),
                };

                switch (block.type) {
                    case 'NOTE':
                        return (
                            <NoteBlock
                                value={block}
                                onChange={set}
                                onReplace={replace}
                                {...props}
                            />
                        );
                    case 'TABLE':
                        return (
                            <TableBlock
                                value={block}
                                onChange={set}
                                {...props}
                            />
                        );
                }
            }}
        </ArrayMap>
    );
}

export default Document;
