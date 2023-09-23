import {
    ControlledComponentProps,
    EmbedBlockData,
    NavigationHandlers,
} from '../data';

function EmbedBlock({
    value,
    onChange,
}: ControlledComponentProps<EmbedBlockData> & NavigationHandlers) {}

export default EmbedBlock;
