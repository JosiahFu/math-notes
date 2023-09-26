import { useState } from 'react';
import { Block, KeyedArray, NoteBlockData, addKey } from './data';
import Document from './components/Document';
import {
    deserializeDocument,
    documentToMarkdown,
    serializeDocument,
} from './serialize';
import { useDownload, useUpload } from './file';
import AutosizeInput from './components/AutosizeInput';

function App() {
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<KeyedArray<Block>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const [downloadLink, setDownload] = useDownload();
    const [exportLink, setExport] = useDownload();

    const handleUpload = useUpload(data => {
        const document = JSON.parse(data);
        setTitle(document.title);
        setBlocks(deserializeDocument(document.blocks));
    });

    return (
        <main className='mx-auto my-8 max-w-5xl'>
            <h1 className='text-center text-4xl'>
                <AutosizeInput
                    value={title}
                    onChange={setTitle}
                    minWidth={100}
                    placeholder='Title'
                    className='outline-none'
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
                download='save.json'
                onClick={() =>
                    setDownload(
                        JSON.stringify({
                            title,
                            blocks: serializeDocument(blocks),
                        })
                    )
                }
                className='block w-max cursor-pointer hover:text-gray-700'>
                Download
            </a>
            <a
                href={exportLink}
                target='_blank'
                download='export.md'
                onClick={() => setExport(documentToMarkdown(title, blocks))}
                className='block w-max cursor-pointer hover:text-gray-700'>
                Export to markdown
            </a>
            <label className='block w-max cursor-pointer hover:text-gray-700'>
                Upload
                <input type='file' onChange={handleUpload} className='hidden' />
            </label>
        </main>
    );
}

export default App;
