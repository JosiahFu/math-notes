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
import DownloadIcon from './assets/download.svg?react';
import OpenIcon from './assets/open.svg?react';
import MarkdownIcon from './assets/markdown.svg?react';

function App() {
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<KeyedArray<BlockData>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const saved = useRef(true);

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

    const provideExport = () => {
        saved.current = true;
        return documentToMarkdown(title, blocks);
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
            <p className='text-gray-500 print:hidden'>
                Type <code>$$</code> to insert math, write <code>\table</code>{' '}
                on an empty line to create a table
            </p>
            <Document value={blocks} onChange={setBlocks} />
            <div className='fixed bottom-4 left-4 flex flex-row gap-2 rounded-lg bg-white/80 p-4 dark:bg-gray-800/80 lg:gap-3'>
                <DownloadButton
                    filename={`${safeFileName(title) || 'Untitled'}.json`}
                    onDownload={provideDownload}>
                    <div className='block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 dark:bg-gray-700 print:hidden'>
                        <DownloadIcon className='h-8 w-8 fill-gray-800 dark:fill-gray-200 lg:h-10 lg:w-10' />
                    </div>
                </DownloadButton>
                <DownloadButton
                    filename={`${safeFileName(title) || 'Untitled'}.md`}
                    onDownload={provideExport}>
                    <div className='block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 dark:bg-gray-700 print:hidden'>
                        <MarkdownIcon className='h-8 w-8 fill-gray-800 dark:fill-gray-200 lg:h-10 lg:w-10' />
                    </div>
                </DownloadButton>
                <UploadButton onUpload={handleUpload}>
                    <div className='block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 dark:bg-gray-700 print:hidden'>
                        <OpenIcon className='h-8 w-8 fill-gray-800 dark:fill-gray-200 lg:h-10 lg:w-10' />
                    </div>
                </UploadButton>
            </div>
        </main>
    );
}

export default App;
