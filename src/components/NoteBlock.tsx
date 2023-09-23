import { ArrayMap } from '@tater-archives/react-array-utils';
import {
    ControlledComponentProps,
    Direction,
    FocusProps,
    MathSegmentData,
    NavigationHandlers,
    NoteBlockData,
    TextSegmentData,
    WithKey,
    addKey,
} from '../data';
import { usePropState } from '@tater-archives/react-use-destructure';
import MathSegment from './MathSegment';
import TextSegment from './TextSegment';
import { useEffect, useState } from 'react';

function NoteBlock({
    value,
    onChange,
    focused,
    onFocus,
    onDownOut,
    onUpOut,
    onInsertAfter,
    onDelete,
}: ControlledComponentProps<WithKey<NoteBlockData>> &
    NavigationHandlers &
    FocusProps) {
    const [content, setContent] = usePropState(value, onChange, 'content');
    // const [children, setChildren] = usePropState(value, onChange, 'children');

    const [focusedSegment, setFocusedSegment] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    useEffect(() => {
        if (focusedSegment) return;
        setFocusedSegment(focused ? [0, undefined] : undefined);
    }, [focused, focusedSegment]);

    return (
        <div className='flex flex-row flex-wrap'>
            <ArrayMap array={content} setArray={setContent} keyProp='key'>
                {(segment, { set, replace }, index, { splice }) => {
                    const props = {
                        onLeftOut: () =>
                            setFocusedSegment([index - 1, 'right']),
                        onRightOut: () =>
                            setFocusedSegment([index + 1, 'left']),
                        onDownOut,
                        onUpOut,
                        onInsertAfter,

                        focused: focused && index === focusedSegment?.[0],
                        focusSide:
                            focused && index === focusedSegment?.[0]
                                ? focusedSegment?.[1]
                                : undefined,
                        onFocus: () => {
                            onFocus();
                            setFocusedSegment([index, undefined]);
                        },
                    };

                    return segment.type === 'MATH' ? (
                        <MathSegment
                            value={segment}
                            onChange={set}
                            onDelete={() => {
                                splice(index - 1, 3, [
                                    addKey(
                                        TextSegmentData(
                                            content[index - 1].content +
                                                content[index + 1].content
                                        )
                                    ),
                                ]);
                                if (!focusedSegment) return;
                                setFocusedSegment([
                                    focusedSegment[0] - 1,
                                    undefined,
                                ]);
                            }}
                            {...props}
                        />
                    ) : (
                        <TextSegment
                            value={segment}
                            onChange={set}
                            onInsertMath={(before, after) => {
                                replace(
                                    addKey(TextSegmentData(before)),
                                    addKey(MathSegmentData('')),
                                    addKey(TextSegmentData(after))
                                );
                                setFocusedSegment([index + 1, undefined]);
                            }}
                            last={index === content.length - 1}
                            onDelete={() => {
                                if (content.length === 1) onDelete?.();
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
