import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { classList, NestedStateArray, StateArray } from './Util';
import { addStyles, MathField, EditableMathField, MathFieldConfig } from '@numberworks/react-mathquill'
addStyles();

const OnChange = createContext<(() => void) | null>(null);

const config: MathFieldConfig = {
    spaceBehavesLikeTab: true,
    autoCommands: 'sqrt pi'
}

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

function MathNoteField({ state: { value, type, isAnswer }, setState, focused, onFocus }: {
    state: MathNoteState,
    setState: (state: MathNoteState) => void,
    focused: boolean,
    onFocus: (event?: React.FocusEvent) => void,
}) {
    const textInput = useRef<HTMLInputElement>(null);
    const mathField = useRef<MathField>();
    const saveHistory = useContext(OnChange);

    const focus = () => {
        if (focused)
            (type === FieldType.Math ? mathField : textInput).current?.focus();
    };

    useEffect(focus, [focused, type]);

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

    const toggleAnswer = () => {
        setState(new MathNoteState(value, type, !isAnswer));
        onFocus();
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'm':
                if (!event.ctrlKey) return;
                toggleAnswer();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    return (
        <div className={classList('note-field', ['answer', isAnswer])} onKeyDown={handleKeyPress}>
            {type === FieldType.Math ?
                <EditableMathField
                    latex={value}
                    onChange={handleMathFieldChange}
                    config={config}
                    onFocus={handleFocus}
                    onBlur={saveHistory!}
                    mathquillDidMount={target => mathField.current = target}
                /> :
                <input
                    className="text-note"
                    onChange={handleTextNoteChange}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={saveHistory!}
                    ref={textInput}
                />}
            <button className="button answer-button" onClick={toggleAnswer}>&#11088;</button> {/* Star emoji */}
        </div>
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

function Notes({ sections, onChange }: { sections: NestedStateArray<MathNoteState>, onChange: () => void }) {
    const [focusIndex, setFocusIndex] = useState<[section: number, field: number] | null>(null);
    const undoHistory = useRef<MathNoteState[][][]>([]);
    const redoHistory = useRef<MathNoteState[][][]>([]);

    const addSection = (index: number) => {
        sections.insert([new MathNoteState()], index);
        setFocusIndex([index, 0]);
    }

    const undo = () => {
        if (undoHistory.current.length === 0) return;
        const newSections = undoHistory.current.pop()!;
        redoHistory.current.push(sections.getArrayArray());
        sections.setArrayArray(newSections);
        if (focusIndex !== null && focusIndex[1] > newSections[focusIndex[0]].length - 1) {
            changeFocusIndex(-1);
        }
    }

    const redo = () => {
        if (redoHistory.current.length === 0) return;
        const newSections = redoHistory.current.pop()!;
        undoHistory.current.push(sections.getArrayArray());
        sections.setArrayArray(newSections);
        if (focusIndex !== null && focusIndex[1] > newSections[focusIndex[0]].length - 1) {
            changeFocusIndex(-1);
        }
    }

    const handleChange = () => {
        if (sections.getArrayArray() === undoHistory.current.at(-1)) return;
        undoHistory.current.push(sections.getArrayArray());
        redoHistory.current = [];
        onChange();
    };

    const handleBlur = () => {
        setFocusIndex(null);
    };

    const changeFocusIndex = (change: number, ignoreBounds = false) => {
        if (focusIndex === null) {
            return;
        }
        let newFocusIndex: typeof focusIndex = [...focusIndex]; // Copy indices
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
            if (newFocusIndex[0] > sections.length - 1) {
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

                // changeFocusIndex(-1);

                if (sections.get(focusIndex[0]).length > 1) { // If there are multiple lines
                    sections.getStateArray(focusIndex[0]).remove(focusIndex[1]);
                    (focusIndex[0] > 0 || focusIndex[1] > 0) && changeFocusIndex(-1);
                    handleChange();
                    break;
                }

                if (sections.length > 1) { // If there is more than one section
                    sections.remove(focusIndex[0]);
                }
                break;
            case "z":
                if (!event.ctrlKey) return;
                undo();
                break;
            case "y":
                if (!event.ctrlKey) return;
                redo();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    return (<div className="notes" onKeyDown={handleKeyDown} onBlur={handleBlur}>
        {sections.mapStateArray((e, i) => (
            <OnChange.Provider key={i} value={handleChange}>
                <NoteSection
                    lines={e}
                    focusIndex={focusIndex?.[0] === i ? focusIndex[1] : null}
                    setFocusIndex={(focusIndex: number) => { setFocusIndex([i, focusIndex]) }}
                />
                <div className="section-button-container">
                    <button className="button section-button" onClick={() => addSection(i + 1)}></button>
                </div>
            </OnChange.Provider>
        ))}
        {/* <button onClick={undo}>undo</button> */}
    </div>);
}

export default Notes;
export { MathNoteState, FieldType };
