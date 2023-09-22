import { ChangeEventHandler, KeyboardEventHandler, useCallback } from 'react';
import {
    ControlledComponentProps,
    NavigationHandlers,
    TextSegmentData,
} from '../data';

function TextSegment<T extends TextSegmentData>({
    value,
    onChange,
    onDownOut,
    onUpOut,
    onLeftOut,
    onRightOut,
    onInsertAfter,
    onDelete,
}: ControlledComponentProps<T> & Partial<NavigationHandlers>) {
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
                    }
                    break;
                default:
                    return;
            }

            event.preventDefault();
        },
        [onDelete, onDownOut, onInsertAfter, onLeftOut, onRightOut, onUpOut]
    );

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            onChange({ ...value, content: event.target.value });
        },
        [onChange, value]
    );

    return (
        <input
            value={value.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    );
}

export default TextSegment;
