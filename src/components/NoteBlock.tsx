import { ArrayMap } from '@tater-archives/react-array-utils';
import {
    ControlledComponentProps,
    Direction,
    NavigationHandlers,
    NoteBlockData,
    addKey,
} from '../data';
import { usePropState } from '@tater-archives/react-use-destructure';
import MathSegment from './MathSegment';
import TextSegment from './TextSegment';
import { useState } from 'react';

function NoteBlock({
    value,
    onChange,
}: ControlledComponentProps<NoteBlockData> & Partial<NavigationHandlers>) {
    const [content, setContent] = usePropState(value, onChange, 'content');
    // const [children, setChildren] = usePropState(value, onChange, 'children');

    const [focused, setFocused] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    return (
        <div>
            <ArrayMap array={content} setArray={setContent} keyProp='key'>
                {(segment, { set, replace }, index) => {
                    const props = {
                        onLeftOut: () => setFocused([index - 1, 'right']),
                        onRightOut: () => setFocused([index + 1, 'left']),
                        focused: index === focused?.[0],
                        focusSide:
                            index === focused?.[0] ? focused?.[1] : undefined,
                        onFocus: () => setFocused([index, undefined]),
                    };

                    return segment.type === 'MATH' ? (
                        <MathSegment
                            value={segment}
                            onChange={set}
                            {...props}
                        />
                    ) : (
                        <TextSegment
                            value={segment}
                            onChange={set}
                            onInsertMath={(before, after) => {
                                replace(
                                    addKey({ type: 'TEXT', content: before }),
                                    addKey({ type: 'MATH', content: '' }),
                                    addKey({ type: 'TEXT', content: after })
                                );
                                setFocused([index + 1, undefined]);
                            }}
                            {...props}
                        />
                    );
                }}
            </ArrayMap>
        </div>
    );
}

export default NoteBlock;
