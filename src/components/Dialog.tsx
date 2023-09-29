import { MouseEventHandler, ReactNode, useEffect, useRef } from 'react';

function Dialog({
    children,
    open = false,
    modal = false,
    popover = false,
    onClose,
}: {
    children?: ReactNode;
    open?: boolean;
    modal?: boolean;
    popover?: boolean;
    onClose?: () => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleClick: MouseEventHandler<HTMLDialogElement> = event => {
        if (event.target === dialogRef.current) {
            dialogRef.current.close();
        }
    };

    useEffect(() => {
        if (open) {
            if (popover) {
                dialogRef.current?.showPopover();
            } else if (modal) {
                dialogRef.current?.showModal();
            } else {
                dialogRef.current?.show();
            }
        } else {
            dialogRef.current?.close();
        }
    }, [modal, open, popover]);

    return (
        <dialog ref={dialogRef} onClose={onClose} onClick={handleClick}>
            {children}
        </dialog>
    );
}

export default Dialog;
