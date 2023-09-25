import { useState } from 'react';
import {
    Block,
    KeyedArray,
    NoteBlockData,
    TableBlockData,
    addKey,
} from './data';
import Document from './components/Document';
import { documentToMarkdown } from './serialize';

function App() {
    const [blocks, setBlocks] = useState<KeyedArray<Block>>(() => [
        addKey(NoteBlockData('')),
        addKey(
            TableBlockData([
                ['x', 'y'],
                ['5', '6'],
            ])
        ),
        addKey(NoteBlockData('')),
    ]);

    return (
        <>
            <Document value={blocks} onChange={setBlocks} />
            <pre>{documentToMarkdown(blocks)}</pre>
        </>
    );
}

export default App;
