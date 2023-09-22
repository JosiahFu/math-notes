import {
    ControlledComponentProps,
    NavigationHandlers,
    TableBlockData,
} from '../data';

function EmbedBlock({
    value,
    onChange,
}: ControlledComponentProps<TableBlockData> & Partial<NavigationHandlers>) {}

export default EmbedBlock;
