import {
    ChangeEventHandler,
    HTMLAttributes,
    forwardRef,
    useLayoutEffect,
    useRef,
} from 'react';

const AutosizeInput = forwardRef(
    (
        {
            value,
            onChange,
            minWidth,
            ...otherProps
        }: {
            value: string;
            onChange: (value: string) => void;
            minWidth?: number;
        } & Omit<HTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>,
        forwardedRef: React.ForwardedRef<HTMLInputElement>
    ) => {
        const inputRef = useRef<HTMLInputElement>();

        const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
            onChange(event.target.value);
        };

        const handleRef = (element: HTMLInputElement) => {
            if (forwardedRef === null) {
                //
            } else if (typeof forwardedRef === 'function') {
                forwardedRef(element);
            } else {
                forwardedRef.current = element;
            }
            inputRef.current = element;
        };

        useLayoutEffect(() => {
            if (!inputRef.current) return;
            inputRef.current.style.width = '0';
            inputRef.current.style.width = `${Math.max(
                inputRef.current.scrollWidth,
                minWidth ?? 0
            )}px`;
        });

        return (
            <input
                ref={handleRef}
                value={value}
                onChange={handleChange}
                {...otherProps}
            />
        );
    }
);

export default AutosizeInput;
