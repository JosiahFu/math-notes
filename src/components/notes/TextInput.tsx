import { ComponentProps, KeyboardEventHandler, useEffect, useRef } from 'react';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import { useDebouncedState } from '@tater-archives/react-use-debounce';
import AutosizeInput from '../AutosizeInput';

function TextInput({
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
    onDeleteOut,
    onInsertMath,
    className,
    ...otherProps
}: ControlledComponentProps<string> &
    NavigationProps &
    Omit<ComponentProps<typeof AutosizeInput>, 'value' | 'onChange'> & {
        onInsertMath?: (before: string, after: string) => void;
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
                if (
                    target.selectionStart === target.selectionEnd &&
                    target.selectionStart == 0
                ) {
                    onDeleteOut?.();
                    break;
                }
                return;
            default:
                return;
        }

        event.preventDefault();
    };

    const [dValue, setDValue] = useDebouncedState(value, onChange, 500);

    const handleChange = (value: string) => {
        if (onInsertMath && (value.includes('<<') || value.includes('$$'))) {
            const split = Math.max(value.indexOf('<<'), value.indexOf('$$')); // TODO this is hacky plz fix thx
            onInsertMath(value.slice(0, split), value.slice(split + 2));
            return;
        }
        setDValue(value);
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
            value={dValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            className={`outline-none ${className}`}
            {...otherProps}
        />
    );
}

export default TextInput;
