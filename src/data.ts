import { Direction as MQDirection } from 'react-mathquill';

type KeyedArray<T extends object> = (T & { key: string | number })[];

interface TextSegmentData {
    type: 'TEXT';
    content: string;
}

interface MathSegmentData {
    type: 'MATH';
    content: string;
}

type Segment = TextSegmentData | MathSegmentData;

interface NoteBlockData {
    content: KeyedArray<Segment>;
    children?: KeyedArray<Block>;
    type: 'NOTE';
    isAnswer: boolean;
}

interface TableBlockData {
    content: KeyedArray<{
        columns: KeyedArray<TextSegmentData | MathSegmentData>;
    }>;
    type: 'TABLE';
}

interface EmbedBlockData {
    url: string;
    type: 'EMBED';
}

type Block = NoteBlockData | TableBlockData | EmbedBlockData;

interface DocumentData {
    content: Block[];
    title: string;
}

interface ControlledComponentProps<T> {
    value: T;
    onChange: (value: T) => void;
}

interface NavigationHandlers {
    onUpOut?: () => void;
    onDownOut?: () => void;
    onLeftOut?: () => void;
    onRightOut?: () => void;
    onInsertAfter?: () => void;
    onDelete?: () => void;
}

type Direction = 'left' | 'right' | 'top' | 'bottom';

const MQDir = {
    left: -1 as MQDirection,
    right: 1 as MQDirection,
};

interface FocusProps {
    focused: boolean;
    focusSide: Direction | undefined;
    onFocus: () => void;
}

export { MQDir };
export type {
    MathSegmentData,
    TextSegmentData,
    Segment,
    NoteBlockData,
    TableBlockData,
    EmbedBlockData,
    Block,
    DocumentData,
    ControlledComponentProps,
    NavigationHandlers,
    KeyedArray,
    FocusProps,
    Direction,
};
