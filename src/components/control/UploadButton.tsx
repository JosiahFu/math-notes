import { ReactNode } from 'react';
import { useUpload } from '../../file';

function UploadButton({
    onUpload,
    children,
    className,
}: {
    onUpload: (data: string) => void;
    children: ReactNode;
    className?: string;
}) {
    return (
        <label className={className}>
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
