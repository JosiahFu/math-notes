import { ReactNode } from 'react';
import { useDownload } from '../../file';

function DownloadButton({
    filename,
    content,
    children,
}: {
    filename: string;
    content: string | (() => string);
    children: ReactNode;
}) {
    const [downloadLink, setDownload] = useDownload();

    return (
        <a
            href={downloadLink}
            target='_blank'
            download={filename}
            onClick={() =>
                setDownload(typeof content === 'string' ? content : content())
            }>
            {children}
        </a>
    );
}

export default DownloadButton;
