import { useEffect, useRef, useState } from 'react';
import { BlockData, NoteBlockData } from './data/notes';
import { KeyedArray, addKey } from './data/keys';
import Document from './components/notes/Document';
import {
    deserializeDocument,
    documentToMarkdown,
    serializeDocument,
} from './data/serialize';
import { safeFileName } from './file';
import { dataFixerUpper } from './data/legacy';
import DownloadButton from './components/control/DownloadButton';
import UploadButton from './components/control/UploadButton';
import {
    DownloadIcon,
    OpenIcon,
    MarkdownIcon,
    PrintIcon,
    PDFIcon,
} from './icons';
import ExportDialog from './components/ExportDialog';
import Tooltip from './components/Tooltip';

function App() {
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<KeyedArray<BlockData>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const saved = useRef(true);

    const [exportShown, setExportShown] = useState(false);

    // Track if document is unsaved
    useEffect(() => {
        saved.current = false;
    }, [blocks]);

    // Set tab title
    useEffect(() => {
        document.title = title ? `Math Notes - ${title}` : 'Math Notes';
    }, [title]);

    // Add handler to prevent unloading page when unsaved
    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            // Disable prevent reload if in DEV mode
            if (import.meta.env.PROD && !saved.current) {
                event.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    const handleUpload = (data: string) => {
        const document = dataFixerUpper(JSON.parse(data));
        setTitle(document.title);
        setBlocks(deserializeDocument(document.blocks));
    };

    const provideDownload = () => {
        saved.current = true;
        return JSON.stringify(serializeDocument(title, blocks));
    };

    return (
        <main className='mx-auto max-w-5xl p-8 print:p-0'>
            <h1 className='my-8 text-3xl sm:text-4xl lg:text-5xl'>
                <input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder='Title'
                    className='w-full text-center outline-none placeholder:italic dark:placeholder:text-gray-600'
                />
            </h1>
            <Document value={blocks} onChange={setBlocks} />

            <Tooltip
                className='fixed right-4 top-4'
                localStorageKey='usageHintShown'>
                Type <code>$$</code> to insert math, write <code>\table</code>{' '}
                and <code>\embed</code> on an empty line to create a table and
                embed respectively
            </Tooltip>

            <div className='fixed bottom-4 left-4 flex flex-row gap-2 rounded-lg bg-white/80 p-4 dark:bg-gray-800/80 lg:gap-3'>
                <DownloadButton
                    filename={`${safeFileName(title) || 'Untitled'}.json`}
                    content={provideDownload}
                    className='button'
                    title='Save and download'>
                    <DownloadIcon className='icon' />
                </DownloadButton>
                <UploadButton
                    onUpload={handleUpload}
                    className='button'
                    title='Open file'>
                    <OpenIcon className='icon' />
                </UploadButton>
                <button className='button' onClick={print} title='Print'>
                    <PrintIcon className='icon' />
                </button>
                <button
                    className='button'
                    onClick={() => {
                        alert('Choose "Save as PDF" as the Destination option');
                        print();
                    }}
                    title='Export as PDF'>
                    <PDFIcon className='icon' />
                </button>
                <button
                    className='button'
                    onClick={() => setExportShown(true)}
                    title='Export as markdown'>
                    <MarkdownIcon className='icon' />
                </button>
            </div>

            {exportShown && (
                <ExportDialog
                    content={documentToMarkdown(title, blocks)}
                    onDownload={() => (saved.current = true)}
                    filename={`${safeFileName(title) || 'Untitled'}.md`}
                    onClose={() => setExportShown(false)}
                />
            )}
        </main>
    );
}

export default App;
