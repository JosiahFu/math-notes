import { Block, EmbedBlockData, KeyedArray, NoteBlockData, Segment, TableBlockData, addKey } from './data';

type SerializedDocument = (Omit<NoteBlockData, 'content'> & { content: Segment[] } | TableBlockData | EmbedBlockData)[];

function serializeDocument(blocks: KeyedArray<Block>): SerializedDocument {
    return blocks.map(block => {
        const output = omit(block, 'key');

        if (block.type === 'NOTE') {
            const segments = block.content.map(e => omit(e, 'key'));
            return { ...output, content: segments };
        }

        return output;
    }) as SerializedDocument;
}

function deserializeDocument(serialized: SerializedDocument): KeyedArray<Block> {
    return serialized.map(e => e.type === 'NOTE' ? { ...e, content: e.content.map(addKey) } : e).map(addKey);
}

function rep(text: string, count: number) {
    return Array(count).fill(text).join('');
}

function documentToMarkdown(blocks: KeyedArray<Block>): string {
    return blocks.map(block => {
        switch (block.type) {
            case 'NOTE':
                return `${rep('  ', block.indent)}- ${block.content.map(e => e.type === 'MATH' ? `$$${e.content}$$` : e.content).join('')}`;
            case 'TABLE':
                return rep('|     ', block.cells[0].length) + '|\n' + rep('| --- ', block.cells[0].length) + '|\n' + block.cells.map(e => `|${e.map(f => ` $$${f}$$ `).join('|')}|`).join('\n');
        }
    }).join('\n');
}

function omit<T extends object, K extends keyof T>(object: T, prop: K): Omit<T, K> {
    const result: Partial<T> = {};
    (Object.keys(object) as (keyof T)[]).forEach(e => {
        if (e === prop) return;
        result[e] = object[e];
    });
    return result as Omit<T, K>;
}

export { serializeDocument, deserializeDocument, documentToMarkdown }
