import { useEffect, useRef } from 'react';

function useHistory<T>(value: T, setValue: (value: T) => void): [undo: () => void, redo: () => void, replace: (value: T) => void, setSaved: () => void, isSaved: boolean] {
    const undoHistory = useRef<T[]>([]); // undoHistory[last] is always equal to blocks
    const redoHistory = useRef<T[]>([]);
    const lastSaved = useRef<T>(value);

    // Add versions to history when value changes
    useEffect(() => {
        if (value === undoHistory.current[undoHistory.current.length - 1]) return;

        undoHistory.current.push(value);
        if (redoHistory.current.length > 1) redoHistory.current.length = 0; // Clear array
    }, [value]);

    const handleUndo = () => {
        if (undoHistory.current.length <= 1) return;

        redoHistory.current.push(undoHistory.current.pop()!);
        setValue(undoHistory.current[undoHistory.current.length - 1]);
    };

    const handleRedo = () => {
        if (redoHistory.current.length === 0) return;

        undoHistory.current.push(
            redoHistory.current[redoHistory.current.length - 1]
        );
        setValue(redoHistory.current.pop()!);
    };

    const handleReplace = (value: T) => {
        undoHistory.current.length = 0;
        lastSaved.current = value;
        setValue(value);
    }

    const handleSave = () => {
        lastSaved.current = value;
    }

    const saved = value === lastSaved.current;

    return [handleUndo, handleRedo, handleReplace, handleSave, saved];
}

export { useHistory };
