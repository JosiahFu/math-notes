import { TextSegmentData } from '../../data/notes';
import { WithKey } from '../../data/keys';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import { usePropState } from '@tater-archives/react-use-destructure';
import TextInput from './TextInput';

function TextSegment({
    value,
    onChange,
    onInsertMath,
    last = false,
    ...otherProps
}: ControlledComponentProps<WithKey<TextSegmentData>> &
    NavigationProps & {
        onInsertMath?: (before: string, after: string) => void;
        last?: boolean;
    }) {
    const [content, setContent] = usePropState(value, onChange, 'content');

    return (
        <TextInput
            value={content}
            onChange={setContent}
            onInsertMath={onInsertMath}
            {...otherProps}
            disableSizing={last}
            className={last ? 'flex-grow' : ''}
        />
    );
}

export default TextSegment;
