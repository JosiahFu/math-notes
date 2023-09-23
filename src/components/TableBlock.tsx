import {
    ControlledComponentProps,
    NavigationHandlers,
    TableBlockData,
} from '../data';

function TableBlock({
    value,
    onChange,
}: ControlledComponentProps<TableBlockData> & Partial<NavigationHandlers>) {}

export default TableBlock;
