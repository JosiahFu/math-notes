import { useEffect, useState } from 'react';
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

    useEffect(() => {
        document.title = title ? `Math Notes - ${title}` : 'Math Notes';
    }, [title]);

    const handleUpload = (data: string) => {
        const document = dataFixerUpper(JSON.parse(data));
        setTitle(document.title);
        setBlocks(deserializeDocument(document.blocks));
    };

    return (
        <main className='mx-auto max-w-5xl p-8'>
            <h1 className='text-4xl'>
                <input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder='Title'
                    className='w-full text-center outline-none'
                />
            </h1>
            <p className='text-gray-500'>
                Type <code>$$</code> to insert math, write <code>\table</code>{' '}
                on an empty line to create a table
            </p>
            <Document value={blocks} onChange={setBlocks} />
            <DownloadButton
                filename={`${safeFileName(title) || 'Untitled'}.json`}
                onDownload={() =>
                    JSON.stringify(serializeDocument(title, blocks))
                }>
                Download
            </DownloadButton>
            <DownloadButton
                filename={`${safeFileName(title) || 'Untitled'}.md`}
                onDownload={() =>
                    JSON.stringify(documentToMarkdown(title, blocks))
                }>
                Export to markdown
            </DownloadButton>
            <UploadButton onUpload={handleUpload}>Upload</UploadButton>
        </main>
    );
}

export default App;
