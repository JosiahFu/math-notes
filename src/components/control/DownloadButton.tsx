import { ReactNode } from 'react';
import { useDownload } from '../../file';

function DownloadButton({
    filename,
    onDownload,
    children,
}: {
    filename: string;
    onDownload: () => string;
    children: ReactNode;
}) {
    const [downloadLink, setDownload] = useDownload();

    return (
        <a
            href={downloadLink}
            target='_blank'
            download={filename}
            onClick={() => setDownload(onDownload())}
            className='block w-max cursor-pointer hover:text-gray-700'>
            {children}
        </a>
    );
}

export default DownloadButton;
