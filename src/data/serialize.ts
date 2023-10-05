import {
    BlockData,
    EmbedBlockData,
    NoteBlockData,
    Segment,
    TableBlockData,
} from './notes';
import { KeyedArray, addKey } from './keys';

type SerializedBlocks = (
    | (Omit<NoteBlockData, 'content'> & { content: Segment[] })
    | TableBlockData
    | EmbedBlockData
)[];

type SerializedDocument = {
    title: string;
    meta?: string;
    blocks: SerializedBlocks;
    version: 3;
};

function serializeBlocks(
    blocks: KeyedArray<BlockData>
) {
    return blocks.map(block => {
            const output = omit(block, 'key');

            if (block.type === 'NOTE') {
                const segments = block.content.map(e => omit(e, 'key'));
                return { ...output, content: segments };
            }

            return output;
    }) as SerializedBlocks
}

function serializeDocument(
    title: string,
    blocks: KeyedArray<BlockData>
): SerializedDocument {
    return {
        title,
        meta: `Open this document at ${window.location.href}`,
        blocks: serializeBlocks(blocks),
        version: 3,
    };
}

function deserializeDocument(
    serialized: SerializedBlocks
): KeyedArray<BlockData> {
    return serialized
        .map(e =>
            e.type === 'NOTE' ? { ...e, content: e.content.map(addKey) } : e
        )
        .map(addKey);
}

function rep(text: string, count: number) {
    return Array(count).fill(text).join('');
}

function documentToMarkdown(
    title: string,
    blocks: KeyedArray<BlockData>
): string {
    return (
        `# ${title}\n\n` +
        blocks
            .map(block => {
                const indentSpaces = rep('  ', block.indent);

                switch (block.type) {
                    case 'NOTE':
                        return `${indentSpaces}- ${
                            block.isAnswer ? '<mark>' : ''
                        }${block.content
                            .map(e =>
                                e.type === 'MATH'
                                    ? block.content.every(
                                          segment =>
                                              segment.type === 'MATH' ||
                                              segment.content === ''
                                      )
                                        ? `$$${e.content}$$`
                                        : `$${e.content}$`
                                    : e.content
                            )
                            .join('')}${block.isAnswer ? '</mark>' : ''}`;
                    case 'TABLE':
                        return (
                            `${indentSpaces}- ` +
                            rep('|     ', block.cells[0].length) +
                            '|\n' +
                            `${indentSpaces}  ` +
                            rep('| --- ', block.cells[0].length) +
                            '|\n' +
                            block.cells
                                .map(
                                    e =>
                                        `${indentSpaces}  |${e
                                            .map(f => ` $$${f}$$ `)
                                            .join('|')}|`
                                )
                                .join('\n')
                        );
                    case 'EMBED':
                        return `${indentSpaces}- <iframe src=${block.url} width=900 height=500 style="border: none;" />`;
                }
            })
            .join('\n')
    );
}

function omit<T extends object, K extends keyof T>(
    object: T,
    prop: K
): Omit<T, K> {
    const result: Partial<T> = {};
    (Object.keys(object) as (keyof T)[]).forEach(e => {
        if (e === prop) return;
        result[e] = object[e];
    });
    return result as Omit<T, K>;
}

export type { SerializedDocument, SerializedBlocks };
export { serializeBlocks, serializeDocument, deserializeDocument, documentToMarkdown };
