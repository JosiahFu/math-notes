import React, { useState } from 'react';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
import './App.css';

addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

interface MathNoteFieldProps {value: string, type: FieldType, setState: (value: string, type: FieldType) => void, focused: boolean, onFocus: (event: React.FocusEvent) => void}

function MathNoteField(props: MathNoteFieldProps) {
    const handleMathFieldChange = (target: MathField) => {
        if (target.latex() === '"') {
            props.setState('', FieldType.Text );
        } else {
            props.setState(target.latex(), props.type);
        }
    }
    
    const handleTextNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setState(event.target.value, props.type);
    }

    return (
        props.type === FieldType.Math ?
            <EditableMathField latex={props.value} onChange={handleMathFieldChange} config={{spaceBehavesLikeTab: true}} onFocus={props.onFocus} />
            : <input className="text-note" onChange={handleTextNoteChange} value={props.value} autoFocus={props.focused} onFocus={props.onFocus} />
    )
}

function App() {
    const [lines, setLines] = useState([{value: '', type: FieldType.Math}] as {value: string, type: FieldType}[]);
    const [focusIndex, setFocusIndex] = useState(0);

    const makeSetState = (index: number) =>
        (value: string, type: FieldType) => setLines(lines.map((e, i) => i === index ? {value: value, type: type} : e));
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch(event.key) {
            case "UpArrow":

                break;
            case "DownArrow":
            case "Enter":
                // setFocusIndex(focusIndex + 1);
                
                break;
            default:
                return;
        }
        event.preventDefault;
    }

    return (
        <div className="App">
            {lines.map((e, i) => <MathNoteField value={e.value} type={e.type} setState={makeSetState(i)} focused={focusIndex === i} onFocus={() => setFocusIndex(i)}/>)}
        </div>
    );
}

export default App;
