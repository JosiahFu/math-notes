import { useEffect, useState } from 'react';
import {
    ControlledComponentProps,
    Direction,
    NavigationProps,
    TableBlockData,
    WithKey,
    addKey,
} from '../data';
import { usePropState } from '@tater-archives/react-use-destructure';
import { ArrayMap } from '@tater-archives/react-array-utils';
import MathInput from './MathInput';

// Table still has weird navigation behavior, revert necessary?

// This code is going to be absolutely horrible to debug later
function TableBlock({
    value,
    onChange,
    focused,
    focusSide,
    onFocus,
    onDownOut,
    onUpOut,
    onDelete,
}: ControlledComponentProps<WithKey<TableBlockData>> & NavigationProps) {
    const [rows, setRows] = usePropState(value, onChange, 'rows');

    const [focusedRow, setFocusedRow] = useState<number>(0);
    const [focusedColumn, setFocusedColumn] = useState<number>(0);
    const [focusedDirection, setFocusedDirection] = useState<
        Direction | undefined
    >();

    useEffect(() => {
        if (focused) {
            if (focusSide === 'bottom') setFocusedRow(rows.length - 1);
            if (focusSide === 'top') setFocusedRow(0);
        }
    }, [focusSide, focused, rows.length]);

    return (
        <table>
            <tbody>
                <ArrayMap array={rows} setArray={setRows} keyProp='key'>
                    {(row, { set: setRow, insertAfter, remove }, rowIndex) => (
                        <tr>
                            <ArrayMap
                                array={row.cells}
                                setArray={cells => setRow({ ...row, cells })}
                                keyProp='key'>
                                {(cell, { set }, columnIndex) => {
                                    const cellFocused =
                                        focused &&
                                        focusedRow === rowIndex &&
                                        focusedColumn === columnIndex;

                                    const focusUp = () => {
                                        setFocusedRow(rowIndex - 1);
                                        setFocusedDirection('bottom');
                                    };
                                    const focusDown = () => {
                                        setFocusedRow(rowIndex + 1);
                                        setFocusedDirection('top');
                                    };
                                    const focusLeft = () => {
                                        setFocusedColumn(columnIndex - 1);
                                        setFocusedDirection('right');
                                    };
                                    const focusRight = () => {
                                        setFocusedColumn(columnIndex + 1);
                                        setFocusedDirection('left');
                                    };

                                    const navigationHandlers = {
                                        onUpOut() {
                                            if (onUpOut && rowIndex <= 0) {
                                                onUpOut();
                                                return;
                                            }
                                            focusUp();
                                        },
                                        onDownOut() {
                                            if (
                                                onDownOut &&
                                                rowIndex >= rows.length - 1
                                            ) {
                                                onDownOut();
                                                return;
                                            }
                                            focusDown();
                                        },
                                        onLeftOut() {
                                            if (focusedColumn <= 0) return;
                                            focusLeft();
                                        },
                                        onRightOut() {
                                            if (
                                                columnIndex >=
                                                row.cells.length - 1
                                            ) {
                                                setRows(
                                                    rows.map(e => ({
                                                        ...e,
                                                        cells: [
                                                            ...e.cells,
                                                            addKey({
                                                                content: '',
                                                            }),
                                                        ],
                                                    }))
                                                );
                                            }
                                            focusRight();
                                        },
                                        onDelete() {
                                            if (
                                                row.cells.every(
                                                    e => e.content === ''
                                                )
                                            ) {
                                                if (
                                                    onDelete &&
                                                    rows.length === 1
                                                ) {
                                                    onDelete();
                                                    return;
                                                }
                                                remove();
                                                // Go to start of previous row
                                                setFocusedColumn(
                                                    row.cells.length - 1
                                                );
                                                setFocusedRow(rowIndex - 1);
                                                setFocusedDirection('right');
                                                return;
                                            }
                                            focusLeft();
                                        },
                                        onInsertAfter() {
                                            insertAfter(
                                                addKey({
                                                    // Create a new empty row
                                                    cells: [
                                                        ...row.cells.keys(),
                                                    ].map(() =>
                                                        addKey({
                                                            content: '',
                                                        })
                                                    ),
                                                })
                                            );
                                            focusDown();
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
                                                focused={cellFocused}
                                                focusSide={
                                                    cellFocused
                                                        ? focusedDirection
                                                        : undefined
                                                }
                                                onFocus={() => {
                                                    onFocus();
                                                    setFocusedColumn(
                                                        columnIndex
                                                    );
                                                    setFocusedRow(rowIndex);
                                                }}
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
