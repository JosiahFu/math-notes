import { useCallback } from 'react';
import {
    ControlledComponentProps,
    MathSegmentData,
    NavigationHandlers,
} from '../data';
import MathInput from './MathInput';

function MathSegment({
    value: { content: value },
    onChange,
    ...otherProps
}: ControlledComponentProps<MathSegmentData> & Partial<NavigationHandlers>) {
    const handleChange = useCallback(
        (value: string) => {
            onChange({ type: 'MATH', content: value });
        },
        [onChange]
    );

    return <MathInput value={value} onChange={handleChange} {...otherProps} />;
}

export default MathSegment;
