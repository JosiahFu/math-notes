import { ReactNode } from 'react';
import { useUpload } from '../../file';

function UploadButton({
    onUpload,
    children,
}: {
    onUpload: (data: string) => void;
    children: ReactNode;
}) {
    return (
        <label className='contents'>
            {children}
            <input
                type='file'
                onChange={useUpload(onUpload)}
                className='hidden'
                accept='.json, application/json'
            />
        </label>
    );
}

export default UploadButton;
