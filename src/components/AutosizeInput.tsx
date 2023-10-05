import {
    ChangeEventHandler,
    HTMLAttributes,
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';

const AutosizeInput = forwardRef(
    (
        {
            value,
            onChange,
            minWidth,
            disableSizing,
            ...otherProps
        }: {
            value: string;
            onChange: (value: string) => void;
            disableSizing?: boolean;
            minWidth?: string;
        } & Omit<
            HTMLAttributes<HTMLInputElement>,
            'value' | 'onChange' | 'style'
        >,
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

        // Adjust size of input
        useLayoutEffect(() => {
            if (disableSizing || !inputRef.current) return;
            inputRef.current.style.width = '0';
            inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
        });

        // Unset input size when disableSizing is turned on
        useEffect(() => {
            if (!disableSizing || !inputRef.current) return;
            inputRef.current.style.width = '';
        }, [disableSizing]);

        return (
            <input
                ref={handleRef}
                value={value}
                onChange={handleChange}
                style={{ minWidth }}
                {...otherProps}
            />
        );
    }
);

export default AutosizeInput;
