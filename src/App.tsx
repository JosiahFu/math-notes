import { useState } from 'react';
import { BlockData, NoteBlockData } from './data/notes';
import { KeyedArray, addKey } from './data/keys';
import Document from './components/notes/Document';
import {
    deserializeDocument,
    documentToMarkdown,
    serializeDocument,
} from './data/serialize';
import { safeFileName, useDownload, useUpload } from './file';
import { dataFixerUpper } from './data/legacy';

function App() {
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<KeyedArray<BlockData>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const [downloadLink, setDownload] = useDownload();
    const [exportLink, setExport] = useDownload();

    const handleUpload = useUpload(data => {
        const document = dataFixerUpper(JSON.parse(data));
        setTitle(document.title);
        setBlocks(deserializeDocument(document.blocks));
    });

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
            {/*These buttons should be extracted into components later */}
            <a
                href={downloadLink}
                target='_blank'
                download={`${safeFileName(title)}.json`}
                onClick={() =>
                    setDownload(
                        JSON.stringify(serializeDocument(title, blocks))
                    )
                }
                className='block w-max cursor-pointer hover:text-gray-700'>
                Download
            </a>
            <a
                href={exportLink}
                target='_blank'
                download={`${safeFileName(title)}.md`}
                onClick={() => setExport(documentToMarkdown(title, blocks))}
                className='block w-max cursor-pointer hover:text-gray-700'>
                Export to markdown
            </a>
            <label className='block w-max cursor-pointer hover:text-gray-700'>
                Upload
                <input
                    type='file'
                    onChange={handleUpload}
                    className='hidden'
                    accept='.json, application/json'
                />
            </label>
        </main>
    );
}

export default App;
