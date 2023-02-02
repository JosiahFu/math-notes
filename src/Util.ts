import React from 'react';

class StateArray<T>{
    array: T[];
    setArray: React.Dispatch<React.SetStateAction<T[]>>;
    map;
    includes;

    constructor(stateHook: [T[], React.Dispatch<React.SetStateAction<T[]>>]) {
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

export { StateArray };
