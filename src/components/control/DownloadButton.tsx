import { ReactNode } from 'react';
import { useDownload } from '../../file';

function DownloadButton({
    filename,
    content,
    children,
    className,
}: {
    filename: string;
    content: string | (() => string);
    children: ReactNode;
    className?: string;
}) {
    const [downloadLink, setDownload] = useDownload();

    return (
        <a
            href={downloadLink}
            target='_blank'
            download={filename}
            onClick={() =>
                setDownload(typeof content === 'string' ? content : content())
            }
            className={className}>
            {children}
        </a>
    );
}

export default DownloadButton;
