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
    cells: string[][];
    indent: number;
}
function TableBlockData(cells: string[][], indent = 0): TableBlockData {
    return {
        type: 'TABLE',
        cells,
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
