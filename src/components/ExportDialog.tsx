import { useRef } from 'react';
import Dialog from './Dialog';
import IconButton from './IconButton';
import DownloadButton from './control/DownloadButton';
import { CopyIcon, DownloadIcon } from '../icons';

function ExportDialog({
    content,
    filename,
    onClose,
    onDownload,
}: {
    content: string;
    filename: string;
    onClose?: () => void;
    onDownload?: () => void;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleCopy = () => {
        textareaRef.current?.select();
        textareaRef.current?.setSelectionRange(0, 999999999);
        navigator.clipboard.writeText(textareaRef.current?.value ?? '');
    };

    return (
        <Dialog onClose={onClose} className='flex flex-col gap-4'>
            <textarea
                ref={textareaRef}
                className='dark:bg-gray-850 h-[60vh] w-[75vw] resize-none overscroll-contain rounded-lg bg-gray-100 p-4 font-mono text-sm text-gray-800 outline-none dark:text-gray-300'
                value={content}
                readOnly
            />

            <div className='flex flex-row gap-2'>
                <DownloadButton
                    filename={filename}
                    content={() => (onDownload?.(), content)}>
                    <IconButton icon={DownloadIcon} />
                </DownloadButton>
                <button onClick={handleCopy}>
                    <IconButton icon={CopyIcon} />
                </button>
            </div>
        </Dialog>
    );
}

export default ExportDialog;
