import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { classList, NestedStateArray, StateArray } from './Util';
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
    isAnswer: boolean;

    constructor(value = '', type = FieldType.Math, isAnswer = false) {
        this.value = value;
        this.type = type;
        this.isAnswer = isAnswer;
    };
}

function MathNoteField({ state: {value, type, isAnswer}, setState, focused, onFocus }: {
    state: MathNoteState,
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

    const handleFocus = (event: React.FocusEvent) => {
        if (event.isTrusted) {
            onFocus(event);
        }
    }

    return (
        type === FieldType.Math ?
            <EditableMathField
                className={classList('note-field', ['answer', isAnswer])}
                latex={value}
                onChange={handleMathFieldChange}
                config={{ spaceBehavesLikeTab: true }}
                onFocus={handleFocus}
                onBlur={saveHistory!}
                mathquillDidMount={target => mathField.current = target}
            /> :
            <input
                className={classList('note-field', 'text-note', ['answer', isAnswer])}
                onChange={handleTextNoteChange}
                value={value}
                onFocus={handleFocus}
                onBlur={saveHistory!}
                ref={textInput}
            />
    );
}

function NoteSection({ lines, focusIndex, setFocusIndex }: {
    lines: StateArray<MathNoteState>,
    focusIndex: number | null,
    setFocusIndex: (focusIndex: number) => void
}) {
    const element = useRef<HTMLDivElement>(null);


    const makeSetState = (index: number) =>
        (state: MathNoteState) => lines.set(state, index);

    return (
        <div className="section" ref={element}>
            {lines.map((e, i) =>
                <MathNoteField
                    key={i}
                    state={e}
                    setState={makeSetState(i)}
                    focused={focusIndex === i}
                    onFocus={() => setFocusIndex(i)}
                />)}
        </div>
    );
}

function Notes({ sections }: { sections: NestedStateArray<MathNoteState> }) {
    const [focusIndex, setFocusIndex] = useState<[number, number] | null>(null);
    const history = useRef<NestedStateArray<MathNoteState>[]>([]);

    const addSection = (index: number) => {
        sections.insert([new MathNoteState()], index);
        setFocusIndex([index, 0]);
    }

    const updateHistory = () => {
        history.current.push(sections);
    }

    const undo = () => {
        if (history.current.length > 0) {
            sections.setArray(history.current.pop()!.array);
        }
    }

    const handleBlur = () => {
        setFocusIndex(null);
    }

    const changeFocusIndex = (change: number, ignoreBounds = false) => {
        if (focusIndex === null) {
            return;
        }
        let newFocusIndex: [number, number] = [...focusIndex]; // Copy indices
        newFocusIndex[1] += change;
        if (ignoreBounds) {
            setFocusIndex(newFocusIndex);
            return;
        }
        while (newFocusIndex[1] < 0) {
            newFocusIndex[0]--;
            if (newFocusIndex[0] < 0) {
                setFocusIndex([0, 0]);
                return;
            }
            newFocusIndex[1] += sections.array[newFocusIndex[0]].length;
        }
        while (newFocusIndex[1] > sections.array[newFocusIndex[0]].length - 1) {
            newFocusIndex[1] -= sections.array[newFocusIndex[0]].length;
            newFocusIndex[0]++;
            if (newFocusIndex[0] >= sections.length - 1) {
                setFocusIndex([sections.length - 1, sections.array[sections.length - 1].length - 1]);
                return;
            }
        }
        setFocusIndex(newFocusIndex);
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (focusIndex === null) {
            return;
        }
        switch (event.key) {
            case "ArrowUp":
                if (!event.ctrlKey) {
                    changeFocusIndex(-1);
                    break;
                }
                if (focusIndex[0] > 0) {
                    setFocusIndex([focusIndex[0] - 1, sections.get(focusIndex[0] - 1).length - 1])
                }
                break;
            case "Enter":
                // Creating new lines
                if (event.ctrlKey) {
                    addSection(focusIndex[0] + 1);
                    break;
                }
                sections.getStateArray(focusIndex[0]).insert(new MathNoteState(), focusIndex[1] + 1);
                changeFocusIndex(1, true);
                break;
            case "ArrowDown":
                if (!event.ctrlKey) {
                    changeFocusIndex(1);
                    break;
                }
                if (focusIndex[0] < sections.length - 1) {
                    setFocusIndex([focusIndex[0] + 1, 0])
                }
                break;
            case "Backspace":
                if (sections.get(focusIndex[0])[focusIndex[1]].value !== '') {
                    return; // Allow native handling
                }

                changeFocusIndex(-1);

                if (sections.get(focusIndex[0]).length > 1) { // If there are multiple lines
                    sections.getStateArray(focusIndex[0]).remove(focusIndex[1]);
                    (focusIndex[0] > 0 || focusIndex[1] > 0) && changeFocusIndex(-1);
                    break;
                }

                if (sections.length > 1) { // If there is more than one section
                    sections.remove(focusIndex[0]);
                }
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    return (<div className="notes" onKeyDown={handleKeyDown} onBlur={handleBlur}>
        {sections.mapStateArray((e, i) => (
            <SaveHistory.Provider key={i} value={updateHistory}>
                <NoteSection
                    lines={e}
                    focusIndex={focusIndex?.[0] === i ? focusIndex[1] : null}
                    setFocusIndex={(focusIndex: number) => { setFocusIndex([i, focusIndex]) }}
                />
                <div className="section-button-container">
                    <button className="button section-button" onClick={() => addSection(i + 1)}></button>
                </div>
            </SaveHistory.Provider>
        ))}
        <button onClick={undo}>undo</button>
    </div>);
}

export default Notes;
export { MathNoteState, FieldType };
