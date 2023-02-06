import React, { useState, useRef, useEffect } from 'react';
import { NestedStateArray, StateArray } from './Util';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

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

interface NoteSectionProps {lines: StateArray<MathNoteState>, singleSection: boolean, deleteSection: () => void};
function NoteSection(props: NoteSectionProps) {
    const [focusIndex, setFocusIndex] = useState(0);
    const element = useRef<HTMLDivElement>(null);
    
    
    const makeSetState = (index: number) =>
        (state: MathNoteState) => props.lines.set(state, index);
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "ArrowUp":
                focusIndex > 0 && setFocusIndex(focusIndex - 1);
                break;
            case "Enter":
                // Creating new lines
                props.lines.insert(new MathNoteState(), focusIndex + 1);
                setFocusIndex(focusIndex + 1);
                break;
            case "ArrowDown":
                focusIndex + 1 < props.lines.length && setFocusIndex(focusIndex + 1);
                break;
            case "Backspace":
                if (props.lines.get(focusIndex).value !== '') {
                    return; // Allow native handling
                }
                
                if (props.lines.length !== 1) { // If there are multiple lines
                    props.lines.remove(focusIndex);
                    focusIndex !== 0 && setFocusIndex(focusIndex - 1);
                    break;
                }
                
                if (!props.singleSection) { // If there is more than one section
                    props.deleteSection();
                }
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    return (
        <div className="section" onKeyDown={handleKeyDown} ref={element}>
            {props.lines.map((e, i) =>
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

interface NotesProps { sections: NestedStateArray<MathNoteState>}
function Notes(props: NotesProps) {
    const makeHandleButtonClick = (index: number) =>
        () => { props.sections.insert([new MathNoteState()], index); }

    return <div className="notes">{props.sections.mapStateArray((e,i) => (
        <React.Fragment key={i}>
            <NoteSection lines={e} singleSection={props.sections.length === 1} deleteSection={() => props.sections.remove(i)} />
            <div className="section-button-container"><button className="section-button" onClick={makeHandleButtonClick(i + 1)}></button></div>
        </React.Fragment>
    ))}</div>;
}

export default Notes;
export { MathNoteState };
