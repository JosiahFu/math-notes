import { HTMLAttributes, ReactNode } from 'react';

function Button({
    className,
    children,
    ...otherProps
}: HTMLAttributes<HTMLDivElement> & {
    className?: string;
    children?: ReactNode;
}) {
    return (
        <div
            className={`block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 dark:bg-gray-700 print:hidden ${className}`}
            {...otherProps}>
            {children}
        </div>
    );
}

export default Button;
