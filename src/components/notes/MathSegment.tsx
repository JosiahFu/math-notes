import {
    ControlledComponentProps,
    MathSegmentData,
    NavigationProps,
    WithKey,
} from '../../data';
import MathInput from './MathInput';
import { usePropState } from '@tater-archives/react-use-destructure';

function MathSegment({
    value,
    onChange,
    onDeleteOut,
    ...otherProps
}: ControlledComponentProps<WithKey<MathSegmentData>> & NavigationProps) {
    const [content, setContent] = usePropState(value, onChange, 'content');

    const handleChange = (value: string) => {
        if (otherProps.onRightOut && value.slice(-2) == '>>') {
            setContent(value.slice(0, -2));
            otherProps.onRightOut();
            return;
        }
        if (otherProps.onRightOut && value.slice(-4) == '\\$\\$') {
            setContent(value.slice(0, -4));
            otherProps.onRightOut();
            return;
        }
        setContent(value);
    };

    const handleDelete = () => {
        if (onDeleteOut && value.content === '') {
            onDeleteOut();
        } else {
            otherProps.onRightOut?.();
        }
    };

    return (
        <MathInput
            value={content}
            onChange={handleChange}
            onDeleteOut={handleDelete}
            {...otherProps}
        />
    );
}

export default MathSegment;
