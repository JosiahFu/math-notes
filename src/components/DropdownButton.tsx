import {
    HTMLAttributes,
    MouseEventHandler,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';

function DropdownButton({
    dropdownContent,
    children,
    ...otherProps
}: {
    dropdownContent: ReactNode;
    children: ReactNode;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'>) {
    const dropdownRef = useRef<HTMLDialogElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [opened, setOpened] = useState(false);
    const [above, setAbove] = useState(false);

    useEffect(() => {
        const handler = () => {
            setOpened(false);
        };
        addEventListener('click', handler);
        return () => removeEventListener('click', handler);
    }, []);

    const handleButtonClick: MouseEventHandler = event => {
        setOpened(!opened);
        event.stopPropagation();
    };

    // Show/hide box
    useEffect(() => {
        if (!dropdownRef.current || !buttonRef.current) return;

        if (!opened) {
            dropdownRef.current.close();
            return;
        }

        dropdownRef.current.show();

        setAbove(
            buttonRef.current.getBoundingClientRect().bottom +
                dropdownRef.current.offsetHeight >
                window.innerHeight
        );
    }, [opened, above]);

    const dialog = (
        <div className='relative'>
            <dialog
                className={`absolute left-0 m-0 ${
                    above ? 'bottom-0' : 'top-0'
                } w-max`}
                ref={dropdownRef}>
                {dropdownContent}
            </dialog>
        </div>
    );

    return (
        <div>
            {above && dialog}
            <button ref={buttonRef} onClick={handleButtonClick} {...otherProps}>
                {children}
            </button>
            {!above && dialog}
        </div>
    );
}

export default DropdownButton;
