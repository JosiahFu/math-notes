import { useState } from 'react';
import {
    ControlledComponentProps,
    Direction,
    FocusProps,
    NavigationHandlers,
    TableBlockData,
    WithKey,
    addKey,
} from '../data';
import { usePropState } from '@tater-archives/react-use-destructure';
import { ArrayMap } from '@tater-archives/react-array-utils';
import MathInput from './MathInput';

// This code is going to be absolutely horrible to debug later
function TableBlock({
    value,
    onChange,
}: ControlledComponentProps<WithKey<TableBlockData>> &
    NavigationHandlers &
    FocusProps) {
        const [content, setContent] = usePropState(value, onChange, 'content');

        const [focusedCell, setFocusedCell] = useState<
            [row: number, column: number, Direction | undefined] | undefined
        >();

        return (
            <table>
                <tbody>
                    <ArrayMap
                        array={content}
                        setArray={setContent}
                        keyProp='key'>
                        {(
                            row,
                            { set: setRow, insertAfter, remove },
                            rowIndex
                        ) => (
                            <tr>
                                <ArrayMap
                                    array={row.columns}
                                    setArray={columns =>
                                        setRow({ ...row, columns })
                                    }
                                    keyProp='key'>
                                    {(cell, { set }, columnIndex) => {
                                        const focused =
                                            focusedCell?.[0] === rowIndex &&
                                            focusedCell?.[1] === columnIndex;

                                        const navigationHandlers = {
                                            onUpOut() {
                                                setFocusedCell([
                                                    rowIndex - 1,
                                                    columnIndex,
                                                    'bottom',
                                                ]);
                                            },
                                            onDownOut() {
                                                setFocusedCell([
                                                    rowIndex + 1,
                                                    columnIndex,
                                                    'top',
                                                ]);
                                            },
                                            onLeftOut() {
                                                setFocusedCell([
                                                    rowIndex,
                                                    columnIndex - 1,
                                                    'right',
                                                ]);
                                            },
                                            onRightOut() {
                                                setFocusedCell([
                                                    rowIndex,
                                                    columnIndex + 1,
                                                    'left',
                                                ]);
                                            },
                                            onDelete() {
                                                if (
                                                    row.columns.every(
                                                        e => e.content === ''
                                                    )
                                                ) {
                                                    remove();
                                                }
                                                setFocusedCell([
                                                    rowIndex - 1,
                                                    columnIndex,
                                                    'bottom',
                                                ]);
                                            },
                                            onInsertAfter() {
                                                insertAfter(
                                                    addKey({
                                                        columns: [
                                                            ...new Array(
                                                                row.columns.length
                                                            ).keys(),
                                                        ].map(() =>
                                                            addKey({
                                                                content: '',
                                                            })
                                                        ),
                                                    })
                                                );
                                                setFocusedCell([
                                                    rowIndex + 1,
                                                    columnIndex,
                                                    'top',
                                                ]);
                                            },
                                        };

                                        return (
                                            <td>
                                                <MathInput
                                                    value={cell.content}
                                                    onChange={newValue =>
                                                        set({
                                                            ...cell,
                                                            content: newValue,
                                                        })
                                                    }
                                                    focused={focused}
                                                    focusSide={
                                                        focused
                                                            ? focusedCell[2]
                                                            : undefined
                                                    }
                                                    onFocus={() =>
                                                        setFocusedCell([
                                                            rowIndex,
                                                            columnIndex,
                                                            undefined,
                                                        ])
                                                    }
                                                    {...navigationHandlers}
                                                />
                                            </td>
                                        );
                                    }}
                                </ArrayMap>
                            </tr>
                        )}
                    </ArrayMap>
                </tbody>
            </table>
        );
    }

export default TableBlock;
