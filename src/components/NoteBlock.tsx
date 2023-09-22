import { ArrayMap } from '@tater-archives/react-array-utils';
import {
    ControlledComponentProps,
    NavigationHandlers,
    NoteBlockData,
} from '../data';
import { useDestructure } from '@tater-archives/react-use-destructure';
import MathSegment from './MathSegment';
import TextSegment from './TextSegment';

function NoteBlock({
    value,
    onChange,
}: ControlledComponentProps<NoteBlockData> & NavigationHandlers) {
    const {
        content: [content, setContent],
        // children: [children, setChildren],
    } = useDestructure(value, onChange);

    return (
        <div>
            <ArrayMap array={content} setArray={setContent} keyProp='key'>
                {(segment, { set }) => {
                    return segment.type === 'MATH' ? (
                        <MathSegment value={segment} onChange={set} />
                    ) : (
                        <TextSegment value={segment} onChange={set} />
                    );
                }}
            </ArrayMap>
        </div>
    );
}

export default NoteBlock;
