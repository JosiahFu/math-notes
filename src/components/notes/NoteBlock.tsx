import { ArrayMap } from '@tater-archives/react-array-utils';
import {
    BlockData,
    Direction,
    EmbedBlockData,
    MathSegmentData,
    NoteBlockData,
    Segment,
    TableBlockData,
    TextSegmentData,
} from '../../data/notes';
import { KeyedArray, WithKey, addKey } from '../../data/keys';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import { usePropState } from '@tater-archives/react-use-destructure';
import MathSegment from './MathSegment';
import TextSegment from './TextSegment';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import { AnswerIcon } from '../../icons';

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
    const [isAnswer, setIsAnswer] = usePropState(value, onChange, 'isAnswer');

    const handleKeyDown: KeyboardEventHandler = event => {
        if (event.key === 'j' && event.ctrlKey) {
            setIsAnswer(!isAnswer);
            event.preventDefault();
        }
    };

    const [focusedSegment, setFocusedSegment] = useState<
        [index: number, side: Direction | undefined] | undefined
    >();

    // Handle Focusing
    useEffect(() => {
        if (focused && focusedSegment === undefined) {
            setFocusedSegment([0, undefined]);
        }
    }, [focused, focusedSegment]);

    // Should this be moved to Document?
    const handleChange = (newContent: KeyedArray<Segment>) => {
        if (onReplace && newContent.length === 1) {
            switch (newContent[0].content) {
                case '\\table':
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
                case '\\htable':
                    onReplace(
                        addKey(
                            TableBlockData(
                                [
                                    ['x', 'y'],
                                    ['', ''],
                                ],
                                value.indent,
                                true
                            )
                        )
                    );
                    return;
                case '\\embed':
                    onReplace(addKey(EmbedBlockData('https://', value.indent)));
                    return;
                default:
            }
        }
        setContent(newContent);
    };

    return (
        <div
            className={`group relative flex flex-grow flex-row flex-wrap items-center ${
                isAnswer && 'rounded-md bg-cyan-400/25 p-1'
            }`}
            onKeyDown={handleKeyDown}>
            <ArrayMap array={content} setArray={handleChange} keyProp='key'>
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
                                if (content.length === 1) {
                                    onDeleteOut?.();
                                } else {
                                    setFocusedSegment([index - 1, 'right']);
                                }
                            }}
                            {...props}
                        />
                    );
                }}
            </ArrayMap>
            <div className='absolute right-1 top-1 hidden group-hover:block'>
                <button
                    className='button p-1'
                    onClick={() => setIsAnswer(!isAnswer)}>
                    <AnswerIcon className='icon h-5 w-5' />
                </button>
            </div>
        </div>
    );
}

export default NoteBlock;
