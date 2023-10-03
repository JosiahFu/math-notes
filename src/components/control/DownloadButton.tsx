import { HTMLAttributes, ReactNode } from 'react';
import { useDownload } from '../../file';

function DownloadButton({
    filename,
    content,
    children,
    className,
    ...otherProps
}: {
    filename: string;
    content: string | (() => string);
    children: ReactNode;
    className?: string;
} & Omit<
    HTMLAttributes<HTMLAnchorElement>,
    'href' | 'target' | 'download' | 'onClick' | 'className' | 'content'
>) {
    const [downloadLink, setDownload] = useDownload();

    return (
        <a
            href={downloadLink}
            target='_blank'
            download={filename}
            onClick={() =>
                setDownload(typeof content === 'string' ? content : content())
            }
            className={className}
            {...otherProps}>
            {children}
        </a>
    );
}

export default DownloadButton;
