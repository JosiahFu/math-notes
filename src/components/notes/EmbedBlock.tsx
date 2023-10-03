import { usePropState } from '@tater-archives/react-use-destructure';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import { EmbedBlockData } from '../../data/notes';
import { useDebouncedState } from '@tater-archives/react-use-debounce';
import { WithKey } from '../../data/keys';
import { KeyboardEventHandler, useEffect, useRef } from 'react';
import Tooltip from '../Tooltip';

function EmbedBlock({
    value,
    onChange,
    focused,
    onFocus,
    onUpOut,
    onDownOut,
    onDeleteOut,
    onInsertAfter,
}: ControlledComponentProps<WithKey<EmbedBlockData>> & NavigationProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [url, setUrl] = usePropState(value, onChange, 'url');

    const [debouncedUrl, setDebouncedUrl] = useDebouncedState(
        url,
        setUrl,
        2000
    );

    const handleKeyDown: KeyboardEventHandler = event => {
        const target = event.target as HTMLInputElement;
        switch (event.key) {
            case 'ArrowUp':
                onUpOut?.();
                break;
            case 'ArrowDown':
                onDownOut?.();
                break;
            case 'Enter':
                onInsertAfter?.();
                break;
            case 'Backspace':
                if (
                    target.selectionStart === target.selectionEnd &&
                    target.selectionStart == 0
                ) {
                    if (url === '') {
                        onDeleteOut?.();
                    } else {
                        onUpOut?.();
                    }
                    break;
                }
                return;
            default:
                return;
        }

        event.preventDefault();
    };

    // Handle focusing
    useEffect(() => {
        if (focused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focused]);

    return (
        <div className='relative flex flex-grow flex-col gap-2 rounded-xl bg-gray-200 p-4 dark:bg-gray-700'>
            <input
                ref={inputRef}
                className='rounded-md bg-gray-300 px-2 py-1 text-blue-700 outline-none dark:bg-gray-600 dark:text-blue-500'
                value={debouncedUrl}
                onChange={event => setDebouncedUrl(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
            />
            <Tooltip
                className='absolute right-6 top-6'
                localStorageKey='embedHintShown'>
                If you are using a Desmos embed, make sure you save the link by
                clicking the share button
            </Tooltip>
            <iframe src={url} className='aspect-video rounded-md' />
        </div>
    );
}

export default EmbedBlock;
