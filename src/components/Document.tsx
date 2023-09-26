import { useState } from 'react';
import {
    Block,
    ControlledComponentProps,
    Direction,
    KeyedArray,
    NavigationProps,
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
                const props: NavigationProps = {
                    onDownOut: () =>
                        index < value.length - 1 &&
                        setFocused([index + 1, 'top']),
                    onUpOut: () =>
                        index > 0 && setFocused([index - 1, 'bottom']),
                    onInsertAfter: () => {
                        insertAfter(addKey(NoteBlockData('', block.indent)));
                        setFocused([index + 1, 'top']);
                    },
                    onDelete: () => {
                        if (value.length <= 1) return;
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
