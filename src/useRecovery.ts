import { useDebounce } from '@tater-archives/react-use-debounce';
import { useEffect } from 'react';
import { useLocalStorage } from '@tater-archives/react-use-localstorage';

function useRecovery<T, S>(name: string, value: T, serialize: (value: T) => S, apply: (serialized: S) => void): [options: string[], recover: (name: string) => void] {
    const [recovery, setRecovery] = useLocalStorage<Record<string, S>>({}, 'recovery');

    const debouncedSaveRecovery = useDebounce(
        (name: string, value: T) =>
            setRecovery({ ...recovery, [name]: serialize(value) }),
        5000
    );

    // Track if document is unsaved
    useEffect(() => {
        debouncedSaveRecovery(name, value);
    }, [debouncedSaveRecovery, name, value]);

    const restore = (name: string) => {
        apply(recovery[name]);
    }

    return [Object.keys(recovery), restore];
}

export { useRecovery };
