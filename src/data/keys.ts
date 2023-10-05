type WithKey<T extends object> = T & { key: string | number };

type KeyedArray<T extends object> = WithKey<T>[];

let currentKey = 0;

/**
 * Keys should not be reused between sessions
 */
function addKey<T extends object>(object: T): WithKey<T> {
    (object as WithKey<T>).key = currentKey;
    currentKey++;
    return object as WithKey<T>;
}

export type { WithKey, KeyedArray };
export { addKey };
