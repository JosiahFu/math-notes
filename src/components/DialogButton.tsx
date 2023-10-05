import {
    HTMLAttributes,
    MouseEventHandler,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';

function DialogButton({
    children,
    dialogContent,
    dialogClassName,
    ...otherProps
}: {
    children: ReactNode;
    dialogContent: ReactNode;
    dialogClassName?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'>) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [dialogShown, setDialogShown] = useState(false);

    useEffect(() => {
        if (dialogShown) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [dialogShown]);

    const handleDialogClick: MouseEventHandler<HTMLDialogElement> = event => {
        if (event.target === dialogRef.current) {
            setDialogShown(false);
        }
    };

    const handleButtonClick: MouseEventHandler<HTMLButtonElement> = event => {
        setDialogShown(true);
        event.stopPropagation();
    };

    return (
        <>
            <button onClick={handleButtonClick} {...otherProps}>
                {children}
            </button>
            <dialog
                ref={dialogRef}
                className='text-inherit backdrop:bg-neutral-900/50'
                onClick={handleDialogClick}>
                <div
                    className={`rounded-xl bg-white p-8 dark:bg-gray-800 ${dialogClassName}`}>
                    {dialogContent}
                </div>
            </dialog>
        </>
    );
}

export default DialogButton;
