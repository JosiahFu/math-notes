import {
    ControlledComponentProps,
    EmbedBlockData,
    NavigationHandlers,
} from '../data';

function EmbedBlock({
    value,
    onChange,
}: ControlledComponentProps<EmbedBlockData> & Partial<NavigationHandlers>) {}

export default EmbedBlock;
