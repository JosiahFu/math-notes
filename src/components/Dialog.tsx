import { MouseEventHandler, ReactNode, useEffect, useRef } from 'react';

function Dialog({
    children,
    onClose,
    className,
}: {
    children?: ReactNode;
    onClose?: () => void;
    className?: string;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleClick: MouseEventHandler<HTMLDialogElement> = event => {
        if (onClose && event.target === dialogRef.current) {
            onClose();
        }
    };

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className='text-inherit backdrop:bg-neutral-900/50'
            onClose={onClose}
            onClick={handleClick}>
            <div
                className={`rounded-xl bg-white p-8 dark:bg-gray-800 ${className}`}>
                {children}
            </div>
        </dialog>
    );
}

export default Dialog;
