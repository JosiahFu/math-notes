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

    constructor(value = '', type = FieldType.Math) {
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
                className="note-field"
                latex={props.value}
                onChange={handleMathFieldChange}
                config={{ spaceBehavesLikeTab: true }}
                onFocus={props.onFocus}
                mathquillDidMount={target => mathField.current = target}
            /> :
            <input
                className="note-field text-note"
                onChange={handleTextNoteChange}
                value={props.value}
                onFocus={props.onFocus}
                ref={textInput}
            />
    );
}

interface SectionBreakProps {addSection: () => void};
function SectionBreak(props: SectionBreakProps) {
    return (<div className="section-break">
        <button onClick={props.addSection} className="section-button">+</button>
    </div>);
}


interface TitleProps {
    value: string,
    setValue: (value: string) => void,
    defaultValue: string,
    onInput: (value: string) => void
}
function Title(props: TitleProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setValue(event.target.value);
    };
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        fixTitle();
        props.onInput(event.target.value);
    }
    
    const fixTitle = () => {
        if (props.value === '') {
            props.setValue(props.defaultValue);
        }
    }

    // Title resetting should ONLY run during initial mount or when user unfocuses
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fixTitle, []);

    return (
        <h1>
            <input
                type="text"
                value={props.value} // If blank
                onChange={handleChange}
                onBlur={handleBlur}
                className={props.value === props.defaultValue ? 'untitled' : ''}
            />
        </h1>
    )
}

interface NotesProps {
    lines: MathNoteState[],
    setLines: (lines: MathNoteState[]) => void,
    sectionBreaks: number[],
    setSectionBreaks: (sectionBreaks: number[]) => void
}
function Notes(props: NotesProps) {
    const lines = props.lines;
    const setLines = props.setLines;
    const sectionBreaks = props.sectionBreaks;
    const setSectionBreaks = props.setSectionBreaks;
    const [focusIndex, setFocusIndex] = useState(0);
    const element = useRef<HTMLDivElement>(null);

    const makeSetState = (index: number) =>
        (state: MathNoteState) => setLines(lines.map((e, i) => i === index ? state : e));
    
    const makeAddSection = (index: number) =>
        () => {
            setLines([
                ...lines.slice(0, focusIndex + 1),
                new MathNoteState(),
                ...lines.slice(focusIndex + 1)
            ]);
            setSectionBreaks([...sectionBreaks.map(e => e >= focusIndex ? e + 1 : e), index - 1]);
        };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "ArrowUp":
                focusIndex > 0 && setFocusIndex(focusIndex - 1);
                break;
            case "Enter":
                // Creating new lines
                setLines([
                    ...lines.slice(0, focusIndex + 1),
                    new MathNoteState(),
                    ...lines.slice(focusIndex + 1)
                ]);
                setSectionBreaks(sectionBreaks.map(e => e >= focusIndex ? e + 1 : e))
                setFocusIndex(focusIndex + 1);
                console.log(sectionBreaks);
                break;
            case "ArrowDown":
                focusIndex + 1 < lines.length && setFocusIndex(focusIndex + 1);
                break;
            case "Backspace":
                if (lines[focusIndex].value === '' && lines.length > 1) {
                    setLines(lines.filter((e, i) => i !== focusIndex))
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
            {lines.map((e, i) => <>
                <MathNoteField
                    key={i}
                    value={e.value}
                    type={e.type}
                    setState={makeSetState(i)}
                    focused={focusIndex === i && (element.current?.contains(document.activeElement) ?? false)}
                    onFocus={() => setFocusIndex(i)}
                />
                {i in sectionBreaks && <SectionBreak addSection={makeAddSection(i)}/>}
            </>)}
            <SectionBreak addSection={makeAddSection(lines.length)}/>
        </div>
    );
}

function App() {
    const [lines, setLines] = useState([new MathNoteState()] as MathNoteState[]);
    const [title, setTitle] = useState('');
    const [sectionBreaks , setSectionBreaks] = useState<number[]>([]);
    
    const setDocumentTitle = (documentTitle: string) => {
        document.title = title || 'Math Notes'; // If blank
    }

    return (
        <main className="app">
            <Title value={title} setValue={setTitle} defaultValue="Untitled Notes" onInput={setDocumentTitle} />
            <Notes lines={lines} setLines={setLines} sectionBreaks={sectionBreaks} setSectionBreaks={setSectionBreaks} />
        </main>
    );

}

export default App;
