import {
    ChangeEventHandler,
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import {
    ControlledComponentProps,
    NavigationHandlers,
    FocusProps,
    TextSegmentData,
} from '../data';

function TextSegment<T extends TextSegmentData>({
    value,
    onChange,
    focused,
    focusSide,
    onDownOut,
    onUpOut,
    onLeftOut,
    onRightOut,
    onInsertAfter,
    onDelete,
    onInsertMath,
}: ControlledComponentProps<T> &
    Partial<NavigationHandlers> & {
        onInsertMath?: (before: string, after: string) => void;
    } & FocusProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown: KeyboardEventHandler = useCallback(
        event => {
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
        },
        [onDelete, onDownOut, onInsertAfter, onLeftOut, onRightOut, onUpOut]
    );

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            const newContent = event.target.value;
            if (onInsertMath && newContent.includes('$$')) {
                const split = newContent.indexOf('$$');
                onInsertMath(
                    newContent.slice(0, split),
                    newContent.slice(split + 2, -1)
                );
                return;
            }
            onChange({ ...value, content: newContent });
        },
        [onChange, onInsertMath, value]
    );

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
        <input
            ref={inputRef}
            value={value.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='Type $$ to insert math'
        />
    );
}

export default TextSegment;
