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
        <label className='block w-max cursor-pointer hover:text-gray-700'>
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
