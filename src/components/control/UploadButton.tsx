import { HTMLAttributes, ReactNode } from 'react';
import { useUpload } from '../../file';

function UploadButton({
    onUpload,
    children,
    className,
    ...otherProps
}: {
    onUpload: (data: string) => void;
    children: ReactNode;
    className?: string;
} & Omit<HTMLAttributes<HTMLLabelElement>, 'className'>) {
    return (
        <label className={className} {...otherProps}>
            <input
                type='file'
                onChange={useUpload(onUpload)}
                className='hidden'
                accept='.json, application/json'
            />
            {children}
        </label>
    );
}

export default UploadButton;
