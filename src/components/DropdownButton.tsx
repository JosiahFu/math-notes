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

    // Show/hide box and reposition
    useEffect(() => {
        if (!dropdownRef.current || !buttonRef.current) return;

        if (!opened) {
            dropdownRef.current.close();
            return;
        }

        dropdownRef.current.show();

        const buttonBox = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;

        const up = dropdownHeight > window.innerHeight - buttonBox.bottom;

        dropdownRef.current.style.left = `${buttonBox.left}px`;
        if (up) {
            dropdownRef.current.style.top = `${
                buttonBox.top - dropdownHeight
            }px`;
        } else {
            dropdownRef.current.style.top = `${buttonBox.bottom}px`;
        }
    }, [opened]);

    return (
        <>
            <button ref={buttonRef} onClick={handleButtonClick} {...otherProps}>
                {children}
            </button>
            <dialog className='fixed m-0' ref={dropdownRef}>
                {dropdownContent}
            </dialog>
        </>
    );
}

export default DropdownButton;
