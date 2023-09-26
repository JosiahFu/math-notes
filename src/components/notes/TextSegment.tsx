import { KeyboardEventHandler, useEffect, useRef } from 'react';
import {
    ControlledComponentProps,
    TextSegmentData,
    WithKey,
    NavigationProps,
} from '../../data';
import { useDebouncedState } from '@tater-archives/react-use-debounce';
import AutosizeInput from '../AutosizeInput';
import { usePropState } from '@tater-archives/react-use-destructure';

function TextSegment({
    value,
    onChange,
    focused,
    focusSide,
    onFocus,
    onDownOut,
    onUpOut,
    onLeftOut,
    onRightOut,
    onInsertAfter,
    onDelete,
    onInsertMath,
    last = false,
}: ControlledComponentProps<WithKey<TextSegmentData>> &
    NavigationProps & {
        onInsertMath?: (before: string, after: string) => void;
        last?: boolean;
    }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown: KeyboardEventHandler = event => {
        const target = event.target as HTMLInputElement;

        switch (event.key) {
            case 'ArrowLeft':
                if (target.selectionStart === 0) {
                    onLeftOut?.();
                    break;
                }
                return;
            case 'ArrowRight':
                if (target.selectionEnd === target.value.length) {
                    onRightOut?.();
                    break;
                }
                return;
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
                if (target.value === '') {
                    onDelete?.();
                    break;
                }
                return;
            default:
                return;
        }

        event.preventDefault();
    };

    const [content, setContent] = usePropState(value, onChange, 'content');

    const [dContent, setDContent] = useDebouncedState(content, setContent, 500);

    const handleChange = (value: string) => {
        if (onInsertMath && (value.includes('<<') || value.includes('$$'))) {
            const split = Math.max(value.indexOf('<<'), value.indexOf('$$')); // TODO this is hacky plz fix thx
            onInsertMath(value.slice(0, split), value.slice(split + 2));
            return;
        }
        setDContent(value);
    };

    const setCursorPosition = (position: number) => {
        if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.selectionEnd =
                position;
        }
    };

    // Handle focusing
    useEffect(() => {
        if (focused && inputRef.current) {
            inputRef.current.focus();
            if (focusSide === 'left') setCursorPosition(0);
            if (focusSide === 'right')
                setCursorPosition(inputRef.current.value.length);
        }
    }, [focusSide, focused]);

    return (
        <AutosizeInput
            ref={inputRef}
            value={dContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            minWidth={1}
            disableSizing={last}
            className={`outline-none ${last ? 'flex-grow' : ''}`}
        />
    );
}

export default TextSegment;
