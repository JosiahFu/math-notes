import React, { useEffect, useRef, useState } from 'react';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
import './App.css';

addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

// type MathNoteState = {value: string, type: FieldType};
class MathNoteState {
    value: string;
    type: FieldType;

    constructor(value: string, type: FieldType) {
        this.value = value;
        this.type = type;
    };
}

interface MathNoteFieldProps {
    value: string,
    type: FieldType,
    setState: (state: MathNoteState) => void,
    focused: boolean,
    onFocus: (event: React.FocusEvent) => void
}

function MathNoteField(props: MathNoteFieldProps) {
    const textInput = useRef<HTMLInputElement>(null);
    const mathField = useRef<MathField>();

    useEffect(() => {
        if (props.focused)
            (props.type === FieldType.Math ? mathField : textInput).current?.focus();
    });

    const handleMathFieldChange = (target: MathField) => {
        if (target.latex() === '"') {
            props.setState(new MathNoteState('', FieldType.Text));
        } else {
            props.setState(new MathNoteState(target.latex(), props.type));
        }
    }

    const handleTextNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setState(new MathNoteState(event.target.value, props.type));
    }

    return (
        props.type === FieldType.Math ?
        <EditableMathField
            latex={props.value}
            onChange={handleMathFieldChange}
            config={{ spaceBehavesLikeTab: true }}
            onFocus={props.onFocus}
            mathquillDidMount={target => mathField.current = target}
        /> :
        <input
            className="text-note"
            onChange={handleTextNoteChange}
            value={props.value}
            onFocus={props.onFocus}
            ref={textInput}
        />
    );
}

interface TitleProps { value: string, setValue: (value: string) => void }
function Title(props: TitleProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setValue(event.target.value);
        document.title = event.target.value || 'Math Notes'; // If blank
    };

    return (
        <h1><input type="text" value={props.value} onChange={handleChange}/></h1>
    )
}

interface NotesProps {lines: MathNoteState[], setLines: (lines: MathNoteState[]) => void}
function Notes(props: NotesProps) {
    const lines = props.lines;
    const setLines = props.setLines;
    const [focusIndex, setFocusIndex] = useState(0);
    const element = useRef<HTMLDivElement>(null);

    const makeSetState = (index: number) =>
        (state: MathNoteState) => setLines(lines.map((e, i) => i === index ? state : e));

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "ArrowUp":
                focusIndex > 0 && setFocusIndex(focusIndex - 1);
                break;
            case "Enter":
                if (focusIndex === lines.length - 1)
                    // Creating new lines
                    setLines([...lines, new MathNoteState('', FieldType.Math)]);
                focusIndex < lines.length && setFocusIndex(focusIndex + 1);
                break;
            case "ArrowDown":
                focusIndex + 1 < lines.length && setFocusIndex(focusIndex + 1);
                break;
            case "Backspace":
                if (lines[focusIndex].value === '' && lines.length > 1) {
                    setLines(lines.filter((e,i) => i !== focusIndex))
                    focusIndex !== 0 && setFocusIndex(focusIndex - 1);
                    break; // Only capture event if something happens
                }
                return;
            default:
                return;
        }
        event.preventDefault();
    }

    return (
        <div className="notes" onKeyDown={handleKeyDown} ref={element}>
            {lines.map((e, i) => 
                <MathNoteField
                    key={i}
                    value={e.value}
                    type={e.type}
                    setState={makeSetState(i)}
                    focused={focusIndex === i && (element.current?.contains(document.activeElement) ?? false)}
                    onFocus={() => setFocusIndex(i)}
                />)}
        </div>
    );
}

function App() {
    const [lines, setLines] = useState([{ value: '', type: FieldType.Math }] as { value: string, type: FieldType }[]);
    const [title, setTitle] = useState('Untitled Notes');

    return (
        <>
            <Title value={title} setValue={setTitle} />
            <Notes lines={lines} setLines={setLines} />
        </>
    );

}

export default App;
