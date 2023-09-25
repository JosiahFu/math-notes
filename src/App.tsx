import { useState } from 'react';
import {
    Block,
    KeyedArray,
    NoteBlockData,
    TableBlockData,
    addKey,
} from './data';
import Document from './components/Document';

function App() {
    const [blocks, setBlocks] = useState<KeyedArray<Block>>(() => [
        addKey(NoteBlockData('')),
        addKey(
            TableBlockData([
                ['x', 'y'],
                ['5', '6'],
            ])
        ),
    ]);

    return (
        <>
            <Document value={blocks} onChange={setBlocks} />
        </>
    );
}

export default App;
