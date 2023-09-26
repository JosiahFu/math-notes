import { useState } from 'react';
import { Block, KeyedArray, NoteBlockData, addKey } from './data';
import Document from './components/Document';
import {
    deserializeDocument,
    documentToMarkdown,
    serializeDocument,
} from './serialize';
import { useDownload, useUpload } from './file';

function App() {
    const [blocks, setBlocks] = useState<KeyedArray<Block>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const [downloadLink, setDownload] = useDownload();
    const [exportLink, setExport] = useDownload();

    const handleUpload = useUpload(data =>
        setBlocks(deserializeDocument(JSON.parse(data)))
    );

    return (
        <>
            <p className='text-gray-500'>
                Type <code>$$</code> to insert math, write <code>\table</code>{' '}
                on an empty line to create a table
            </p>
            <Document value={blocks} onChange={setBlocks} />
            {/*These buttons should be extracted into components later */}
            <a
                href={downloadLink}
                target='_blank'
                download='save.json'
                onClick={() =>
                    setDownload(JSON.stringify(serializeDocument(blocks)))
                }
                className='block w-max cursor-pointer'>
                Download
            </a>
            <a
                href={exportLink}
                target='_blank'
                download='export.md'
                onClick={() => setExport(documentToMarkdown(blocks))}
                className='block w-max cursor-pointer'>
                Export to markdown
            </a>
            <label className='block w-max cursor-pointer'>
                Upload
                <input type='file' onChange={handleUpload} className='hidden' />
            </label>
        </>
    );
}

export default App;
