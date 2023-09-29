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
            onClick={() => setDownload(onDownload())}>
            {children}
        </a>
    );
}

export default DownloadButton;
