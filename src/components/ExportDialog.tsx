import { useRef } from 'react';
import DownloadButton from './control/DownloadButton';
import { CopyIcon, DownloadIcon } from '../icons';

function ExportDialog({
    content,
    filename,
    onDownload,
}: {
    content: string;
    filename: string;
    onDownload?: () => void;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleCopy = () => {
        textareaRef.current?.select();
        textareaRef.current?.setSelectionRange(0, 999999999);
        navigator.clipboard.writeText(textareaRef.current?.value ?? '');
    };

    return (
        <>
            <textarea
                ref={textareaRef}
                className='h-[60vh] w-[75vw] resize-none overscroll-contain rounded-lg bg-gray-100 p-4 font-mono text-sm outline-none dark:bg-gray-850 '
                value={content}
                readOnly
            />

            <div className='flex flex-row gap-2'>
                <DownloadButton
                    filename={filename}
                    content={() => (onDownload?.(), content)}
                    className='button'
                    title='Download'>
                    <DownloadIcon className='icon' />
                </DownloadButton>
                <button
                    onClick={handleCopy}
                    className='button'
                    title='Copy text'>
                    <CopyIcon className='icon' />
                </button>
            </div>
        </>
    );
}

export default ExportDialog;
