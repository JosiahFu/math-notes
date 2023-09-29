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
        return JSON.stringify(documentToMarkdown(title, blocks));
    };

    return (
        <main className='mx-auto max-w-5xl p-8 print:p-0'>
            <h1 className='my-8 text-4xl'>
                <input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder='Title'
                    className='w-full text-center outline-none'
                />
            </h1>
            <p className='text-gray-500 print:hidden'>
                Type <code>$$</code> to insert math, write <code>\table</code>{' '}
                on an empty line to create a table
            </p>
            <Document value={blocks} onChange={setBlocks} />
            <div className='fixed bottom-4 left-4 flex flex-row gap-4 bg-white p-4'>
                <DownloadButton
                    filename={`${safeFileName(title) || 'Untitled'}.json`}
                    onDownload={provideDownload}>
                    <div className='block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 print:hidden'>
                        Download
                    </div>
                </DownloadButton>
                <DownloadButton
                    filename={`${safeFileName(title) || 'Untitled'}.md`}
                    onDownload={provideExport}>
                    <div className='block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 print:hidden'>
                        Export to markdown
                    </div>
                </DownloadButton>
                <UploadButton onUpload={handleUpload}>
                    <div className='block w-max cursor-pointer rounded-lg bg-gray-300 p-2 transition hover:opacity-80 print:hidden'>
                        Upload
                    </div>
                </UploadButton>
            </div>
        </main>
    );
}

export default App;
