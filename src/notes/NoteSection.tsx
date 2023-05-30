import { useRef } from 'react';
import { produce } from 'immer';
import MathNoteField, { MathNoteState } from './MathNoteField';

function NoteSection({ lines, setLines, focusIndex, setFocusIndex, keyboardHandlers }: {
    lines: MathNoteState[],
    setLines: (lines: MathNoteState[]) => void
    focusIndex: number | null,
    setFocusIndex: (focusIndex: number) => void,
    keyboardHandlers: Record<'up' | 'down' | 'add' | 'delete', () => void>
}) {
    const element = useRef<HTMLDivElement>(null);


    const makeSetState = (index: number) =>
        (state: MathNoteState) => setLines(produce(lines, draft => {
            draft[index] = state;
        }));

    return (
        <div className="section" ref={element}>
            {lines.map((e, i) =>
                <MathNoteField
                    key={i}
                    state={e}
                    setState={makeSetState(i)}
                    focused={focusIndex === i}
                    onFocus={() => setFocusIndex(i)}
                    keyboardHandlers={keyboardHandlers}
                />)}
        </div>
    );
}

export default NoteSection;
