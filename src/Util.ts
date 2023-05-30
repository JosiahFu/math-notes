class StateArray<T>{
    array: T[];
    setArray;
    map;
    includes;

    constructor(stateHook: [T[], (state: T[]) => void]) {
        [this.array, this.setArray] = stateHook;
        this.map = this.array.map.bind(this.array);
        this.includes = this.array.includes.bind(this.array);
    }

    get(index: number) {
        return this.array[index];
    }

    add(item: T) {
        this.setArray([...this.array, item]);
    }

    insert(item: T, index: number) {
        this.setArray([
            ...this.array.slice(0, index),
            item,
            ...this.array.slice(index)
        ]);
    }

    set(item: T, index: number) {
        this.setArray(this.array.map((e, i) => index === i ? item : e));
    }

    remove(index: number) {
        this.setArray(this.array.filter((e, i) => i !== index));
    }

    get length() {
        return this.array.length;
    }
}

class NestedStateArray<T> extends StateArray<T[]> {
    // constructor(stateHook: [T[][], (state: T[][]) => void]) {
    //     super(stateHook);
    // }

    getStateArray(index: number) {
        return new StateArray([this.get(index), (item: T[]) => this.set(item, index)]);
    }

    get mapStateArray() {
        const mappedArray = this.array.map((e, i) => this.getStateArray(i));
        return mappedArray.map.bind(mappedArray);
    }

    setArrayArray(arrayArray: T[][]) {
        this.array.forEach((e, i) => this.getStateArray(i).setArray(arrayArray[i]))
    }

    getArrayArray() {
        return this.mapStateArray(e => e.array);
    }
}

/**
 * A utility that makes composing class names easier.
 * 
 * @param classNames A list of class names or `false` values, where `false`
 * values will be omitted. Recommended conditional usage:
 * ```
 * classList('class-a', condition && 'class-b')
 * ```
 * @returns The final list of classes processed into one string.
 */
function classList(...classNames: (string | false)[]): string {
    return (
        classNames
            .filter(e => e !== false)
            .join(' ')
    );
}

export { StateArray, NestedStateArray, classList };
