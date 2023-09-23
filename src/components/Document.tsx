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
            {(value, { set, insertAfter, remove }, index) => {
                const props: NavigationHandlers & FocusProps = {
                    onDownOut: () => setFocused([index + 1, 'top']),
                    onUpOut: () => setFocused([index - 1, 'bottom']),
                    onInsertAfter: () => {
                        insertAfter(addKey(NoteBlockData('')));
                        setFocused([index + 1, 'top']);
                    },
                    onDelete: remove,

                    focused: index === focused?.[0],
                    focusSide: index === focused?.[0] ? focused[1] : undefined,
                    onFocus: () => setFocused([index, undefined]),
                };

                switch (value.type) {
                    case 'NOTE':
                        return (
                            <NoteBlock
                                value={value}
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
