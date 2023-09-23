import {
    ControlledComponentProps,
    MathSegmentData,
    NavigationHandlers,
    FocusProps,
    WithKey,
} from '../data';
import MathInput from './MathInput';
import { usePropState } from '@tater-archives/react-use-destructure';

function MathSegment({
    value,
    onChange,
    ...otherProps
}: ControlledComponentProps<WithKey<MathSegmentData>> &
    Partial<NavigationHandlers> &
    FocusProps) {
    const [content, setContent] = usePropState(value, onChange, 'content');

    return <MathInput value={content} onChange={setContent} {...otherProps} />;
}

export default MathSegment;
