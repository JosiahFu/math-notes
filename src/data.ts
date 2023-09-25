import { Direction as MQDirection } from 'react-mathquill';

type WithKey<T extends object> = T & { key: string | number };

type KeyedArray<T extends object> = WithKey<T>[];

let currentKey = 0;

function addKey<T extends object>(object: T): WithKey<T> {
    (object as WithKey<T>).key = currentKey;
    currentKey++;
    return object as WithKey<T>;
}

interface TextSegmentData {
    type: 'TEXT';
    content: string;
}
function TextSegmentData(content: string): TextSegmentData {
    return { type: 'TEXT', content };
}

interface MathSegmentData {
    type: 'MATH';
    content: string;
}
function MathSegmentData(content: string): MathSegmentData {
    return { type: 'MATH', content };
}

type Segment = TextSegmentData | MathSegmentData;

interface NoteBlockData {
    type: 'NOTE';
    content: KeyedArray<Segment>;
    indent: number;
    isAnswer: boolean;
}
function NoteBlockData(
    content: string | KeyedArray<Segment>,
    indent = 0,
    isAnswer = false
): NoteBlockData {
    return {
        type: 'NOTE',
        content:
            typeof content === 'string'
                ? [addKey(TextSegmentData(content))]
                : content,
        indent,
        isAnswer,
    };
}

interface TableBlockData {
    type: 'TABLE';
    rows: KeyedArray<{
        cells: KeyedArray<{ content: string }>;
    }>;
    indent: number;
}
function TableBlockData(cells: string[][], indent = 0): TableBlockData {
    return {
        type: 'TABLE',
        rows: cells.map(e =>
            addKey({ cells: e.map(e => addKey({ content: e })) })
        ),
        indent,
    };
}

interface EmbedBlockData {
    type: 'EMBED';
    url: string;
    indent: number;
}
function EmbedBlockData(url: string, indent = 0): EmbedBlockData {
    return { type: 'EMBED', url, indent };
}

type Block = NoteBlockData | TableBlockData | EmbedBlockData;

interface DocumentData {
    content: KeyedArray<Block>;
    title: string;
}

interface ControlledComponentProps<T> {
    value: T;
    onChange: (value: T) => void;
}

type Direction = 'left' | 'right' | 'top' | 'bottom';

const MQDir = {
    left: -1 as MQDirection,
    right: 1 as MQDirection,
};

interface NavigationProps {
    focused: boolean;
    focusSide: Direction | undefined;
    onFocus: () => void;
    onUpOut?: () => void;
    onDownOut?: () => void;
    onLeftOut?: () => void;
    onRightOut?: () => void;
    onInsertAfter?: () => void;
    onDelete?: () => void;
}

// function omit<T extends object, K extends keyof T>(object: T, prop: K): Omit<T, K> {
//     const result: Partial<T> = {};
//     (Object.keys(object) as (keyof T)[]).forEach(e => {
//         if (e === prop) return;
//         result[e] = object[e];
//     });
//     return result as Omit<T, K>;
// }

export {
    addKey,
    MQDir,
    TextSegmentData,
    MathSegmentData,
    NoteBlockData,
    TableBlockData,
    EmbedBlockData,
};
export type {
    WithKey,
    KeyedArray,
    Segment,
    Block,
    DocumentData,
    ControlledComponentProps,
    NavigationProps,
    Direction,
};
