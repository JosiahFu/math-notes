import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { NestedStateArray, StateArray } from './Util';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
addStyles();

const SaveHistory = createContext<(() => void) | null>(null);

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

function MathNoteField({value, type, setState, focused, onFocus}: {
    value: string,
    type: FieldType,
    setState: (state: MathNoteState) => void,
    focused: boolean,
    onFocus: (event: React.FocusEvent) => void,
}) {
    const textInput = useRef<HTMLInputElement>(null);
    const mathField = useRef<MathField>();
    const saveHistory = useContext(SaveHistory);

    useEffect(() => {
        if (focused)
            (type === FieldType.Math ? mathField : textInput).current?.focus();
    });

    const handleMathFieldChange = (target: MathField) => {
        if (target.latex() === '"') {
            setState(new MathNoteState('', FieldType.Text));
        } else {
            setState(new MathNoteState(target.latex(), type));
        }
    }

    const handleTextNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(new MathNoteState(event.target.value, type));
    }

    return (
        type === FieldType.Math ?
            <EditableMathField
                className="note-field"
                latex={value}
                onChange={handleMathFieldChange}
                config={{ spaceBehavesLikeTab: true }}
                onFocus={onFocus}
                onBlur={saveHistory!}
                mathquillDidMount={target => mathField.current = target}
            /> :
            <input
                className="note-field text-note"
                onChange={handleTextNoteChange}
                value={value}
                onFocus={onFocus}
                onBlur={saveHistory!}
                ref={textInput}
            />
    );
}

function NoteSection({lines, singleSection, deleteSection}: {
    lines: StateArray<MathNoteState>,
    singleSection: boolean,
    deleteSection: () => void
}) {
    const [focusIndex, setFocusIndex] = useState(0);
    const element = useRef<HTMLDivElement>(null);
    
    
    const makeSetState = (index: number) =>
        (state: MathNoteState) => lines.set(state, index);
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "ArrowUp":
                focusIndex > 0 && setFocusIndex(focusIndex - 1);
                break;
            case "Enter":
                // Creating new lines
                lines.insert(new MathNoteState(), focusIndex + 1);
                setFocusIndex(focusIndex + 1);
                break;
            case "ArrowDown":
                focusIndex + 1 < lines.length && setFocusIndex(focusIndex + 1);
                break;
            case "Backspace":
                if (lines.get(focusIndex).value !== '') {
                    return; // Allow native handling
                }
                
                if (lines.length !== 1) { // If there are multiple lines
                    lines.remove(focusIndex);
                    focusIndex !== 0 && setFocusIndex(focusIndex - 1);
                    break;
                }
                
                if (!singleSection) { // If there is more than one section
                    deleteSection();
                }
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    return (
        <div className="section" onKeyDown={handleKeyDown} ref={element}>
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

function Notes({sections}: {sections: NestedStateArray<MathNoteState>}) {
    const history = useRef<NestedStateArray<MathNoteState>[]>([]);

    const makeHandleButtonClick = (index: number) =>
        () => { sections.insert([new MathNoteState()], index); }
        
    const updateHistory = () => {
        history.current.push(sections);
    }
    
    const undo = () => {
        if (history.current.length > 0) {
            sections.setArray(history.current.pop()!.array);
        }
    }

    return <div className="notes">{sections.mapStateArray((e,i) => (
        <SaveHistory.Provider key={i} value={updateHistory}>
            <NoteSection
                lines={e}
                singleSection={sections.length === 1}
                deleteSection={() => sections.remove(i)}
            />
            <div className="section-button-container">
                <button className="section-button" onClick={makeHandleButtonClick(i + 1)}></button>
            </div>
        </SaveHistory.Provider>
    ))}<button onClick={undo}>undo</button></div>;
}

export default Notes;
export { MathNoteState, FieldType };
