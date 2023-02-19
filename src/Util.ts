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
        this.setArray(this.array.map((e,i) => index === i ? item : e));
    }
    
    remove(index: number) {
        this.setArray(this.array.filter((e,i) => i !== index));
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
        const mappedArray = this.array.map((e,i) => this.getStateArray(i));
        return mappedArray.map.bind(mappedArray);
    }
}

function classList(...classes: (string | [className: string, isActivated: boolean])[]) {
    return classes
        .filter(e => typeof e === 'string' || e[1])
        .map(e => typeof e === 'string' ? e : e[1])
        .join(' ');
}

export { StateArray, NestedStateArray, classList };
