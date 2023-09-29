import { useEffect, useRef } from 'react';

function useHistory<T>(value: T, setValue: (value: T) => void) {
    const undoHistory = useRef<T[]>([]); // undoHistory[last] is always equal to blocks
    const redoHistory = useRef<T[]>([]);
    const ignoreEdit = useRef(false);

    useEffect(() => {
        if (ignoreEdit.current) {
            ignoreEdit.current = false;
            return;
        }

        undoHistory.current.push(value);
        if (redoHistory.current.length > 1) redoHistory.current.length = 0; // Clear array
    }, [value])

    const handleUndo = () => {
        if (undoHistory.current.length <= 1) return;

        ignoreEdit.current = true;
        redoHistory.current.push(undoHistory.current.pop()!);
        setValue(undoHistory.current[undoHistory.current.length - 1]);
    }

    const handleRedo = () => {
        if (redoHistory.current.length === 0) return;

        ignoreEdit.current = true;
        undoHistory.current.push(redoHistory.current[redoHistory.current.length - 1]);
        setValue(redoHistory.current.pop()!);
    }

    return [handleUndo, handleRedo];
}

export { useHistory };
