import { BlockData } from '../../data/notes';
import { KeyedArray, WithKey } from '../../data/keys';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteBlock from './NoteBlock';
import TableBlock from './TableBlock';
import { KeyboardEventHandler } from 'react';
import EmbedBlock from './EmbedBlock';

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

    const handleBulletClick = () => {
        otherProps.onFocus();
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
            case 'EMBED':
                return (
                    <EmbedBlock
                        value={value}
                        onChange={onChange}
                        {...otherProps}
                    />
                );
        }
    })();

    return (
        <div
            className='my-1 flex flex-row items-start'
            onKeyDown={handleKeyDown}
            style={{ marginLeft: `${value.indent * 2}em` }}>
            <div
                className='flex-shrink-0 cursor-pointer px-2 py-3 after:block after:h-1 after:w-1 after:rounded-full after:bg-gray-400 after:dark:bg-gray-500'
                onClick={handleBulletClick}
            />
            {blockType}
        </div>
    );
}

export default Block;
