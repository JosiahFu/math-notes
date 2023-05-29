import React, { useState, useRef, createContext } from 'react';
import { produce } from 'immer';
import { MathNoteState } from './MathNoteField';
import NoteSection from './NoteSection';

const OnChange = createContext<(() => void) | null>(null);

function Notes({ sections, setSections, onChange }: { sections: MathNoteState[][], setSections: (sections: MathNoteState[][]) => void, onChange: () => void }) {
    const [focusIndex, setFocusIndex] = useState<[section: number, field: number] | null>(null);
    const undoHistory = useRef<MathNoteState[][][]>([]);
    const redoHistory = useRef<MathNoteState[][][]>([]);

    const addSection = (index: number) => {
        setSections(produce(sections, draft => { draft.splice(index, 0, [new MathNoteState()]) }))
        setFocusIndex([index, 0]);
    }

    const makeSetSection = (index: number) =>
        (section: MathNoteState[]) =>
            setSections(produce(sections, draft => {
                draft[index] = section;
            }));

    const undo = () => {
        if (undoHistory.current.length === 0) return;
        const newSections = undoHistory.current.pop()!;
        redoHistory.current.push(sections);
        setSections(newSections);
        // If the current section is gone
        if (focusIndex !== null && focusIndex[0] > newSections.length - 1) {
            // Go to end of last section
            setFocusIndex([newSections.length - 1, newSections[newSections.length - 1].length - 1]);
        }
        // If the current section is too small
        if (focusIndex !== null && focusIndex[1] > newSections[focusIndex[0]].length - 1) {
            // Go to end of section
            setFocusIndex([focusIndex[0], newSections[focusIndex[0]].length - 1]);
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
            setFocusIndex([newSections.length - 1, newSections[newSections.length - 1].length - 1]);
        }
        // If the current section is too small
        if (focusIndex !== null && focusIndex[1] > newSections[focusIndex[0]].length - 1) {
            // Go to end of section
            setFocusIndex([focusIndex[0], newSections[focusIndex[0]].length - 1]);
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

    // const changeFocusIndex = (change: number, ignoreBounds = false) => {
    //     if (focusIndex === null) {
    //         return;
    //     }
    //     let newFocusIndex: typeof focusIndex = [...focusIndex]; // Copy indices
    //     newFocusIndex[1] += change;
    //     if (ignoreBounds) {
    //         setFocusIndex(newFocusIndex);
    //         return;
    //     }
    //     while (newFocusIndex[1] < 0) {
    //         newFocusIndex[0]--;
    //         if (newFocusIndex[0] < 0) {
    //             setFocusIndex([0, 0]);
    //             return;
    //         }
    //         newFocusIndex[1] += sections[newFocusIndex[0]].length;
    //     }
    //     while (newFocusIndex[1] > sections[newFocusIndex[0]].length - 1) {
    //         newFocusIndex[1] -= sections[newFocusIndex[0]].length;
    //         newFocusIndex[0]++;
    //         if (newFocusIndex[0] > sections.length - 1) {
    //             setFocusIndex([sections.length - 1, sections[sections.length - 1].length - 1]);
    //             return;
    //         }
    //     }
    //     setFocusIndex(newFocusIndex);
    // }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (focusIndex === null) {
            return;
        }
        switch (event.key) {
            case "ArrowUp":
                if (event.ctrlKey) {
                    // Are we not at the beginning of this section?
                    if (focusIndex[1] > 0) {
                        // Go to beginning of section
                        setFocusIndex([focusIndex[0], 0]);
                        break;
                    }
                    // We are on the first line, is there a previous section?
                    if (focusIndex[0] > 0) {
                        // Go to beginning of previous section
                        setFocusIndex([focusIndex[0] - 1, 0])
                    }
                } else {
                    // Are we not at the beginning of this section?
                    if (focusIndex[1] > 0) {
                        // Move up one
                        setFocusIndex([focusIndex[0], focusIndex[1] - 1]);
                        break;
                    }
                    // We are on the first line, is there a previous section?
                    if (focusIndex[0] > 0) {
                        // Go to end of previous section
                        setFocusIndex([focusIndex[0] - 1, sections[focusIndex[0] - 1].length - 1]);
                    }
                }
                break;

            case "Enter":
                // Creating new lines
                if (event.ctrlKey) {
                    addSection(focusIndex[0] + 1);
                    setFocusIndex([focusIndex[0] + 1, 0]);
                    break;
                }
                setSections(produce(sections, draft => {
                    draft[focusIndex[0]].splice(focusIndex[1] + 1, 0, new MathNoteState());
                }));
                setFocusIndex([focusIndex[0], focusIndex[1] + 1]);
                break;

            case "ArrowDown":
                if (event.ctrlKey) {
                    // Are we not at the end of this section?
                    if (focusIndex[1] < sections[focusIndex[0]].length - 1) {
                        // Go to end of this section
                        setFocusIndex([focusIndex[0], sections[focusIndex[0]].length - 1]);
                        break;
                    }
                    // We are at the end of this section, is there a next section?
                    if (focusIndex[0] < sections.length - 1) {
                        // Go to end of next section
                        setFocusIndex([focusIndex[0] + 1, sections[focusIndex[0] + 1].length - 1]);
                    }
                } else {
                    // Are we not at the end of this section?
                    if (focusIndex[1] < sections[focusIndex[0]].length - 1) {
                        // Move down one
                        setFocusIndex([focusIndex[0], focusIndex[1] + 1]);
                        break;
                    }
                    // We are at the end of this section, is there a next section?
                    if (focusIndex[0] < sections.length - 1) {
                        // Go to beginning of next section
                        setFocusIndex([focusIndex[0] + 1, 0]);
                    }
                }
                break;
            case "Backspace":
                if (sections[focusIndex[0]][focusIndex[1]].value !== '') {
                    // TODO fix delete on clearing math field
                    return; // Allow native handling
                }

                // Are there multiple lines in this section?
                if (sections[focusIndex[0]].length > 1) {
                    // Delete this line
                    setSections(produce(sections, draft => {
                        draft[focusIndex[0]].splice(focusIndex[1], 1);
                    }));
                    // Are we not on the first line?
                    if (focusIndex[1] > 0) {
                        // Move up one
                        setFocusIndex([focusIndex[0], focusIndex[1] - 1]);
                        // Are we not in the first section?
                    } else if (focusIndex[0] > 0) {
                        // Go to end of last section
                        setFocusIndex([focusIndex[0] - 1, sections[focusIndex[0] - 1].length - 1]);
                    }
                    handleChange();
                    break;
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
                        setFocusIndex([focusIndex[0] - 1, sections[focusIndex[0] - 1].length - 1]);
                    } else {
                        // Go to beginning of first section
                        setFocusIndex([0, 0]);
                    }
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
