import React, { useEffect, useRef, useState } from 'react';
import { addStyles, MathField, EditableMathField } from '@numberworks/react-mathquill'
import { StateArray } from './Util';

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

interface NotesProps {
    lines: StateArray<MathNoteState>,
    sectionBreaks: StateArray<number>,
}
function Notes(props: NotesProps) {
    const lines = props.lines;
    const sectionBreaks = props.sectionBreaks;
    const [focusIndex, setFocusIndex] = useState(0);
    const element = useRef<HTMLDivElement>(null);

    const makeSetState = (index: number) =>
        (state: MathNoteState) => lines.set(state, index)
    
    const makeAddSection = (index: number) =>
        () => {
            lines.insert(new MathNoteState(), index + 1);
            sectionBreaks.setArray([...sectionBreaks.map(e => e >= index ? e + 1 : e), index]);
            setFocusIndex(index + 1);
        };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "ArrowUp":
                focusIndex > 0 && setFocusIndex(focusIndex - 1);
                break;
            case "Enter":
                // Creating new lines
                lines.insert(new MathNoteState(), focusIndex + 1);
                sectionBreaks.setArray(sectionBreaks.map(e => e >= focusIndex ? e + 1 : e))
                setFocusIndex(focusIndex + 1);
                console.log(sectionBreaks.array);
                break;
            case "ArrowDown":
                focusIndex + 1 < lines.length && setFocusIndex(focusIndex + 1);
                break;
            case "Backspace":
                if (lines.get(focusIndex).value === '' && lines.length > 1) {
                    lines.remove(focusIndex);
                    sectionBreaks.setArray(sectionBreaks.map(e => e >= focusIndex ? e - 1 : e))
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
            {lines.map((e, i) => <React.Fragment key={i}>
                <MathNoteField
                    value={e.value}
                    type={e.type}
                    setState={makeSetState(i)}
                    focused={focusIndex === i && (element.current?.contains(document.activeElement) ?? false)}
                    onFocus={() => setFocusIndex(i)}
                />
                {sectionBreaks.includes(i) && <SectionBreak addSection={makeAddSection(i)}/>}
            </React.Fragment>)}
            <SectionBreak addSection={makeAddSection(lines.length - 1)}/>
        </div>
    );
}

export { MathNoteState, Notes };
