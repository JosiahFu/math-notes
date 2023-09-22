import { useState } from 'react';
import { KeyedArray, NoteBlockData, Segment } from './data';
import NoteBlock from './components/NoteBlock';

function App() {
    const [segments, setSegments] = useState<KeyedArray<Segment>>(() => [
        { type: 'TEXT', content: 'HELLO ', key: crypto.randomUUID() },
        { type: 'MATH', content: 'x=5', key: crypto.randomUUID() },
        { type: 'TEXT', content: ' WORLD', key: crypto.randomUUID() },
    ]);

    const handleSetBlock = ({ content }: NoteBlockData) => {
        setSegments(content);
    };

    return (
        <>
            <NoteBlock
                value={{ content: segments, type: 'NOTE', isAnswer: false }}
                onChange={handleSetBlock}
            />
        </>
    );
}

export default App;
