import React, { useState } from 'react';
import { addStyles, MathField, EditableMathField, EditableMathFieldProps } from '@numberworks/react-mathquill'
import './App.css';

addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

interface MathNoteFieldProps {value: [string, React.Dispatch<React.SetStateAction<string>>], onFocus: (event: React.FocusEvent) => null}

function MathNoteField(props: MathNoteFieldProps) {
    const [type, setType] = useState(props.value.charAt(0) == '"' ? FieldType.Text : FieldType.Math);
    const [value, setValue] = props.value;
    
    const handleMathFieldChange = (target: MathField) => {
        if (target.latex() == '"') {
            setType(FieldType.Text);
        }
        setValue(target.latex());
    }
    
    const handleTextNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('"' + event.target.value);
    }

    return (
        type === FieldType.Math ?
            <EditableMathField latex={value} onChange={handleMathFieldChange} config={{spaceBehavesLikeTab: true}} onFocus={props.onFocus} />
            : <input autoFocus className="text-note" onChange={handleTextNoteChange} value={} onFocus={props.onFocus} />
    )
}

function App() {
    const [lines, setLines] = useState([] as string[]);
    const [focusIndex, setFocusIndex] = useState(0);
    return (
        <div className="App">
            {lines.map((e, i) => <MathNoteField value={e} onFocus={() => setFocusIndex(i)}/>)}
        </div>
    );
}

export default App;
