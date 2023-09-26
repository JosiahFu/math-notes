import {
    BlockData,
    ControlledComponentProps,
    KeyedArray,
    NavigationProps,
    WithKey,
} from '../data';
import NoteBlock from './NoteBlock';
import TableBlock from './TableBlock';
import { KeyboardEventHandler } from 'react';

function Block({
    value,
    onChange,
    onReplace,
    onIndent,
    ...otherProps
}: ControlledComponentProps<WithKey<BlockData>> &
    NavigationProps & {
        onReplace?: (...blocks: KeyedArray<BlockData>) => void;
        onIndent?: (change: -1 | 1) => void;
    }) {
    const handleKeyDown: KeyboardEventHandler = event => {
        if (event.key !== 'Tab') return;
        event.preventDefault();
        if (event.shiftKey) {
            if (value.indent <= 0) return;
            onIndent?.(-1);
        } else {
            onIndent?.(1);
        }
    };

    const blockType = (() => {
        switch (value.type) {
            case 'NOTE':
                return (
                    <NoteBlock
                        value={value}
                        onChange={onChange}
                        onReplace={onReplace}
                        {...otherProps}
                    />
                );
            case 'TABLE':
                return (
                    <TableBlock
                        value={value}
                        onChange={onChange}
                        {...otherProps}
                    />
                );
        }
    })();

    return (
        <div
            className='my-1 flex flex-row flex-wrap items-center'
            onKeyDown={handleKeyDown}
            style={{ marginLeft: `${value.indent * 2}em` }}>
            <div className='ml-2 mr-2 h-1 w-1 rounded-full bg-gray-400' />
            {blockType}
        </div>
    );
}

export default Block;
