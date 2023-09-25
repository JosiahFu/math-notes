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

                                    const navigationHandlers = {
                                        onUpOut() {
                                            if (onUpOut && rowIndex <= 0) {
                                                onUpOut();
                                                return;
                                            }
                                            setFocusedRow(rowIndex - 1);
                                            setFocusedDirection('bottom');
                                        },
                                        onDownOut() {
                                            if (
                                                onDownOut &&
                                                rowIndex >= rows.length - 1
                                            ) {
                                                onDownOut();
                                                return;
                                            }
                                            setFocusedRow(rowIndex + 1);
                                            setFocusedDirection('top');
                                        },
                                        onLeftOut() {
                                            setFocusedColumn(columnIndex - 1);
                                            setFocusedDirection('right');
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
                                            setFocusedColumn(columnIndex + 1);
                                            setFocusedDirection('left');
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
                                                setFocusedRow(rowIndex - 1);
                                                setFocusedDirection('bottom');
                                                return;
                                            }
                                            setFocusedColumn(columnIndex - 1);
                                            setFocusedDirection('right');
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
                                            setFocusedRow(rowIndex + 1);
                                            setFocusedDirection('top');
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
