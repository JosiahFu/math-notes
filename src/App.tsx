import { useState } from 'react';
import MathSegment from './components/MathSegment';
import { MathSegmentData, TextSegmentData } from './data';
import TextSegment from './components/TextSegment';

function App() {
    const [math, setMath] = useState<MathSegmentData>({
        type: 'MATH',
        content: '',
    });

    const [text, setText] = useState<TextSegmentData>({
        type: 'TEXT',
        content: '',
    });

    return (
        <>
            <MathSegment
                value={math}
                onChange={setMath}
                onInsertAfter={() => console.log('insert')}
                onDelete={() => console.log('delete')}
            />
            <TextSegment
                value={text}
                onChange={setText}
                onLeftOut={() => console.log('left')}
                onRightOut={() => console.log('right')}
                onUpOut={() => console.log('up')}
                onDownOut={() => console.log('down')}
            />
        </>
    );
}

export default App;
