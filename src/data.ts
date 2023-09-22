
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
    children: KeyedArray<Block>;
    type: 'NOTE';
    isAnswer: boolean;
}

interface TableBlockData {
    content: KeyedArray<{ columns: KeyedArray<TextSegmentData | MathSegmentData> }>;
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
    onUpOut: () => void;
    onDownOut: () => void;
    onLeftOut: () => void;
    onRightOut: () => void;
    onInsertAfter: () => void;
    onDelete: () => void;
}

export type { MathSegmentData, TextSegmentData, NoteBlockData, TableBlockData, Block, DocumentData, ControlledComponentProps, NavigationHandlers };
