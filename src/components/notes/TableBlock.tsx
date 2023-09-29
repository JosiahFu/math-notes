import { useEffect, useState } from 'react';
import { Direction, TableBlockData } from '../../data/notes';
import { WithKey } from '../../data/keys';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
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
    onDeleteOut,
}: ControlledComponentProps<WithKey<TableBlockData>> & NavigationProps) {
    const [cells, setCells] = usePropState(value, onChange, 'cells');

    const [focusedRow, setFocusedRow] = useState<number>(0);
    const [focusedColumn, setFocusedColumn] = useState<number>(0);
    const [focusedDirection, setFocusedDirection] = useState<
        Direction | undefined
    >();

    // Handle focusing
    useEffect(() => {
        if (focused) {
            if (focusSide === 'bottom') setFocusedRow(cells.length - 1);
            if (focusSide === 'top') setFocusedRow(0);
        }
    }, [focusSide, focused, cells.length]);

    return (
        <table className='border-collapse'>
            <tbody>
                <ArrayMap array={cells} setArray={setCells}>
                    {(row, { set: setRow, insertAfter, remove }, rowIndex) => (
                        <tr>
                            <ArrayMap array={row} setArray={setRow}>
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
                                                rowIndex >= cells.length - 1
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
                                            if (columnIndex >= row.length - 1) {
                                                setCells(
                                                    cells.map(e => [...e, ''])
                                                );
                                            }
                                            focusRight();
                                        },
                                        onDeleteOut() {
                                            if (
                                                columnIndex === 0 &&
                                                row.every(e => e === '')
                                            ) {
                                                if (
                                                    onDeleteOut &&
                                                    cells.length === 1
                                                ) {
                                                    onDeleteOut();
                                                    return;
                                                }
                                                remove();
                                                // Go to start of previous row
                                                setFocusedColumn(
                                                    row.length - 1
                                                );
                                                setFocusedRow(rowIndex - 1);
                                                setFocusedDirection('right');
                                                return;
                                            }
                                            focusLeft();
                                        },
                                        onInsertAfter() {
                                            insertAfter(row.map(() => ''));
                                            focusDown();
                                        },
                                    };

                                    return (
                                        <td className='border border-solid border-gray-400 p-0 text-center focus-within:bg-gray-100'>
                                            <MathInput
                                                value={cell}
                                                onChange={set}
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
