import { useState } from 'react';
import MathSegment from './components/MathSegment';
import { MathSegmentData } from './data';

function App() {
    const [value, setValue] = useState<MathSegmentData>({
        type: 'MATH',
        content: '',
    });

    return <MathSegment value={value} onChange={setValue} />;
}

export default App;
