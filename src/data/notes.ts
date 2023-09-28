import { KeyedArray, addKey } from './keys';

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

type BlockData = NoteBlockData | TableBlockData | EmbedBlockData;

type Direction = 'left' | 'right' | 'top' | 'bottom';

export {
    TextSegmentData,
    MathSegmentData,
    NoteBlockData,
    TableBlockData,
    EmbedBlockData,
};
export type {
    Segment,
    BlockData,
    Direction,
};
