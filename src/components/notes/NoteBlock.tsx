import { ArrayMap } from '@tater-archives/react-array-utils';
import {
    BlockData,
    ControlledComponentProps,
    Direction,
    KeyedArray,
    MathSegmentData,
    NavigationProps,
    NoteBlockData,
    Segment,
    TableBlockData,
    TextSegmentData,
    WithKey,
    addKey,
} from '../../data';
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
    onDeleteOut,
    onReplace,
}: ControlledComponentProps<WithKey<NoteBlockData>> &
    NavigationProps & {
        onReplace?: (...blocks: KeyedArray<BlockData>) => void;
    }) {
    const [content, setContent] = usePropState(value, onChange, 'content');

    const [focusedSegment, setFocusedSegment] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    useEffect(() => {
        if (focused && focusedSegment === undefined) {
            setFocusedSegment([0, undefined]);
        }
    }, [focused, focusedSegment]);

    const handleChange = (newContent: KeyedArray<Segment>) => {
        if (
            onReplace &&
            newContent.length === 1 &&
            newContent[0].content === '\\table'
        ) {
            onReplace(
                addKey(
                    TableBlockData(
                        [
                            ['', ''],
                            ['', ''],
                        ],
                        value.indent
                    )
                )
            );
            return;
        }
        setContent(newContent);
    };

    return (
        <ArrayMap array={content} setArray={handleChange} keyProp='key'>
            {(segment, { set, replace }, index, { splice }) => {
                const props = {
                    onLeftOut: () => setFocusedSegment([index - 1, 'right']),
                    onRightOut: () => setFocusedSegment([index + 1, 'left']),
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
                        onDeleteOut={() => {
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
                        onDeleteOut={() => {
                            if (content.length === 1) onDeleteOut?.();
                        }}
                        {...props}
                    />
                );
            }}
        </ArrayMap>
    );
}

export default NoteBlock;
