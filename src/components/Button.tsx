import { HTMLAttributes, ReactNode } from 'react';

function Button({
    className,
    children,
    ...otherProps
}: HTMLAttributes<HTMLButtonElement> & {
    className?: string;
    children?: ReactNode;
}) {
    return (
        <button
            className={`block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 dark:bg-gray-700 print:hidden ${className}`}
            {...otherProps}>
            {children}
        </button>
    );
}

export default Button;
