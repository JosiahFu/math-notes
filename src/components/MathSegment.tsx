import { useCallback } from 'react';
import {
    ControlledComponentProps,
    MathSegmentData,
    NavigationHandlers,
} from '../data';
import MathInput from './MathInput';

function MathSegment<T extends MathSegmentData>({
    value,
    onChange,
    ...otherProps
}: ControlledComponentProps<T> & Partial<NavigationHandlers>) {
    const handleChange = useCallback(
        (newValue: string) => {
            onChange({ ...value, content: newValue });
        },
        [onChange, value]
    );

    return (
        <MathInput
            value={value.content}
            onChange={handleChange}
            {...otherProps}
        />
    );
}

export default MathSegment;
