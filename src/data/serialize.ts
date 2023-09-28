import {
    BlockData,
    EmbedBlockData,
    NoteBlockData,
    Segment,
    TableBlockData,
} from './notes';
import { KeyedArray, addKey } from './keys';

type SerializedDocument = (
    | (Omit<NoteBlockData, 'content'> & { content: Segment[] })
    | TableBlockData
    | EmbedBlockData
)[];

function serializeDocument(blocks: KeyedArray<BlockData>): SerializedDocument {
    return blocks.map(block => {
        const output = omit(block, 'key');

        if (block.type === 'NOTE') {
            const segments = block.content.map(e => omit(e, 'key'));
            return { ...output, content: segments };
        }

        return output;
    }) as SerializedDocument;
}

function deserializeDocument(
    serialized: SerializedDocument
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
                        return `${indentSpaces}- ${block.content
                            .map(e =>
                                e.type === 'MATH'
                                    ? block.content.length === 3
                                        ? `$$${e.content}$$`
                                        : `$${e.content}$`
                                    : e.content
                            )
                            .join('')}`;
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

export { serializeDocument, deserializeDocument, documentToMarkdown };
