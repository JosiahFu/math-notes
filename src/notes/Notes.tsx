import React, { useState, useRef, createContext, useEffect } from 'react';
import { produce } from 'immer';
import { MathNoteState } from './MathNoteField';
import NoteSection from './NoteSection';

const OnChange = createContext<(() => void) | null>(null);

function Notes({ sections, setSections, onChange }: { sections: MathNoteState[][], setSections: (sections: MathNoteState[][]) => void, onChange: () => void }) {
    const [focusIndex, setFocusIndex] = useState<[section: number, field: number] | null>(null);
    const undoHistory = useRef<MathNoteState[][][]>([]);
    const redoHistory = useRef<MathNoteState[][][]>([]);
    const ctrlPressed = useRef(false);

    const addSection = (index: number) => {
        setSections(produce(sections, draft => { draft.splice(index, 0, [new MathNoteState()]) }))
        setFocusIndex([index, 0]);
    }

    const makeSetSection = (index: number) =>
        (section: MathNoteState[]) =>
            setSections(produce(sections, draft => {
                draft[index] = section;
            }));

    const changeFocusIndex = (section: 'last' | 'same' | 'next' | 'start' | 'end', line: 'last' | 'same' | 'next' | 'start' | 'end', newSections = sections) => {
        if (focusIndex === null) return;
        let sectionIndex;
        switch (section) {
            case 'last': sectionIndex = focusIndex[0] - 1; break;
            case 'same': sectionIndex = focusIndex[0]; break;
            case 'next': sectionIndex = focusIndex[0] + 1; break;
            case 'start': sectionIndex = 0; break;
            case 'end': sectionIndex = newSections.length - 1; break;
        }
        let lineIndex;
        switch (line) {
            case 'last': lineIndex = focusIndex[1] - 1; break;
            case 'same': lineIndex = focusIndex[1]; break;
            case 'next': lineIndex = focusIndex[1] + 1; break;
            case 'start': lineIndex = 0; break;
            case 'end': lineIndex = newSections[sectionIndex].length - 1; break;
        }
        setFocusIndex([sectionIndex, lineIndex]);
    }

    const focusUp = () => {
        if (focusIndex === null) return;
        // Are we not at the beginning of this section?
        if (focusIndex[1] > 0) {
            // Move up one
            changeFocusIndex('same', 'last');
            return;
        }
        // We are on the first line, is there a previous section?
        if (focusIndex[0] > 0) {
            // Go to end of previous section
            changeFocusIndex('last', 'end');
        }
    }

    const focusUpSkip = () => {
        if (focusIndex === null) return;
        // Are we not at the beginning of this section?
        if (focusIndex[1] > 0) {
            // Go to beginning of section
            changeFocusIndex('same', 'start');
            return;
        }
        // We are on the first line, is there a previous section?
        if (focusIndex[0] > 0) {
            // Go to beginning of previous section
            changeFocusIndex('last', 'start');
        }
    }

    const focusDown = () => {
        if (focusIndex === null) return;
        // Are we not at the end of this section?
        if (focusIndex[1] < sections[focusIndex[0]].length - 1) {
            // Move down one
            changeFocusIndex('same', 'next');
            return;
        }
        // We are at the end of this section, is there a next section?
        if (focusIndex[0] < sections.length - 1) {
            // Go to beginning of next section
            changeFocusIndex('next', 'start');
        }
    }

    const focusDownSkip = () => {
        if (focusIndex === null) return;
        // Are we not at the end of this section?
        if (focusIndex[1] < sections[focusIndex[0]].length - 1) {
            // Go to end of this section
            changeFocusIndex('same', 'end');
            return;
        }
        // We are at the end of this section, is there a next section?
        if (focusIndex[0] < sections.length - 1) {
            // Go to end of next section
            changeFocusIndex('next', 'end');
        }
    }

    const deleteFocused = () => {
        if (focusIndex === null) return;

        // Are there multiple lines in this section?
        if (sections[focusIndex[0]].length > 1) {
            // Delete this line
            setSections(produce(sections, draft => {
                draft[focusIndex[0]].splice(focusIndex[1], 1);
            }));
            focusUp();
            handleChange();
            return;
        }

        // There is only one line, are there multiple sections?
        if (sections.length > 1) {
            // Delete this section
            setSections(produce(sections, draft => {
                draft.splice(focusIndex[0], 1);
            }))
            // Are we not on the first section?
            if (focusIndex[0] > 0) {
                // Go to end of last section
                focusUp();
            }
        }
    }

    const addSectionFocused = () => {
        if (focusIndex === null) return;
        addSection(focusIndex[0] + 1);
        changeFocusIndex('next', 'start');

    }

    const addLineFocused = () => {
        if (focusIndex === null) return;
        setSections(produce(sections, draft => {
            draft[focusIndex[0]].splice(focusIndex[1] + 1, 0, new MathNoteState());
        }));
        changeFocusIndex('same', 'next');
    }

    const undo = () => {
        if (undoHistory.current.length === 0) return;
        const newSections = undoHistory.current.pop()!;
        redoHistory.current.push(sections);
        setSections(newSections);
        // If the current section is gone
        if (focusIndex !== null && focusIndex[0] > newSections.length - 1) {
            // Go to end of last section
            changeFocusIndex('last', 'end', newSections);
        }
        // If the current section is too small
        if (focusIndex !== null && focusIndex[1] > newSections[focusIndex[0]].length - 1) {
            // Go to end of section
            changeFocusIndex('same', 'end', newSections);
        }
    }

    const redo = () => {
        if (redoHistory.current.length === 0) return;
        const newSections = redoHistory.current.pop()!;
        undoHistory.current.push(sections);
        setSections(newSections);
        // If the current section is gone
        if (focusIndex !== null && focusIndex[0] > newSections.length - 1) {
            // Go to end of last section
            changeFocusIndex('last', 'end', newSections);
        }
        // If the current section is too small
        if (focusIndex !== null && focusIndex[1] > newSections[focusIndex[0]].length - 1) {
            // Go to end of section
            changeFocusIndex('same', 'end', newSections);
        }
    }

    const handleChange = () => {
        if (sections === undoHistory.current.at(-1)) return;
        undoHistory.current.push(sections);
        redoHistory.current = [];
        onChange();
    };

    const handleBlur = () => {
        setFocusIndex(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (focusIndex === null) {
            return;
        }
        switch (event.key) {
            case "ArrowUp":
                if (event.ctrlKey) {
                    focusUpSkip();
                } else {
                    focusUp();
                }
                break;

            case "Enter":
                // Creating new lines
                if (event.ctrlKey) {
                    addSectionFocused();
                } else {
                    addLineFocused();
                }
                break;

            case "ArrowDown":
                if (event.ctrlKey) {
                    focusDownSkip();
                } else {
                    focusDown();
                }
                break;
            case "Backspace":
                if (sections[focusIndex[0]][focusIndex[1]].value !== '') {
                    // TODO fix delete on clearing math field
                    return; // Allow native handling
                }

                deleteFocused();
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
        {/* <div className="section-button-container">
            <button className="button section-button" onClick={() => addSection(0)}></button>
        </div> */}
        {sections.map((e, i) => (
            <OnChange.Provider key={i} value={handleChange}>
                <NoteSection
                    lines={e}
                    setLines={makeSetSection(i)}
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
export { OnChange };
