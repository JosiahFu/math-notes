import { useEffect, useRef, useState } from 'react';
import { BlockData, NoteBlockData } from './data/notes';
import { KeyedArray, addKey } from './data/keys';
import Document from './components/notes/Document';
import {
    SerializedDocument,
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
    FeedbackIcon,
    RecoveryIcon,
} from './icons';
import ExportDialog from './components/ExportDialog';
import Tooltip from './components/Tooltip';
import DialogButton from './components/DialogButton';
import { useHistory } from './useHistory';
import DropdownButton from './components/DropdownButton';
import { useRecovery } from './useRecovery';

function App() {
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<KeyedArray<BlockData>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const [undo, redo, replaceHistory, setSaved, saved] = useHistory(
        blocks,
        setBlocks
    );

    const loadSerialized = (serialized: SerializedDocument) => {
        const document = dataFixerUpper(serialized);
        setTitle(document.title);
        replaceHistory(deserializeDocument(document.blocks));
    };

    const [recoveryOptions, loadRecovery] = useRecovery(
        title,
        blocks,
        saved,
        blocks => serializeDocument(title, blocks),
        loadSerialized
    );

    const savedRef = useRef(saved);
    savedRef.current = saved;

    // Set tab title
    useEffect(() => {
        document.title = title ? `Math Notes - ${title}` : 'Math Notes';
    }, [title]);

    // Add handler to prevent unloading page when unsaved
    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            // Disable prevent reload if in DEV mode
            if (import.meta.env.PROD && !savedRef.current) {
                event.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    const confirmReplace = () => {
        return saved || confirm('Replace current document?');
    };

    const handleUpload = (data: string) => {
        if (!confirmReplace()) return;
        loadSerialized(JSON.parse(data));
    };

    const provideDownload = () => {
        setSaved();
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

            <Document
                value={blocks}
                onChange={setBlocks}
                onUndo={undo}
                onRedo={redo}
            />

            <Tooltip
                className='fixed right-4 top-4'
                localStorageKey='usageHintShown'>
                Type <code>$$</code> to insert math, write <code>\table</code>{' '}
                and <code>\embed</code> on an empty line to create a table and
                embed respectively
            </Tooltip>

            <div className='fixed bottom-4 left-4 flex flex-row gap-2 rounded-lg bg-white/80 p-4 dark:bg-gray-800/80 print:hidden lg:gap-3'>
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
                <DialogButton
                    className='button'
                    dialogClassName='flex flex-col gap-4'
                    title='Export as markdown'
                    dialogContent={
                        <ExportDialog
                            content={documentToMarkdown(title, blocks)}
                            onDownload={setSaved}
                            filename={`${safeFileName(title) || 'Untitled'}.md`}
                        />
                    }>
                    <MarkdownIcon className='icon' />
                </DialogButton>
                {recoveryOptions.length > 0 && (
                    <DropdownButton
                        className='button'
                        title='Recover unsaved documents'
                        dropdownContent={
                            <div className='my-1 flex max-h-64 flex-col gap-2px divide-y-2 divide-white overflow-y-auto rounded-lg dark:divide-gray-800'>
                                {recoveryOptions.map((e, i) => (
                                    <button
                                        key={i}
                                        className='button w-auto rounded-none px-2 py-1 text-left'
                                        onClick={() => {
                                            if (!confirmReplace()) return;
                                            loadRecovery(e);
                                        }}>
                                        {e || <em>Untitled</em>}
                                    </button>
                                ))}
                            </div>
                        }>
                        <RecoveryIcon className='icon' />
                    </DropdownButton>
                )}
            </div>

            <DialogButton
                className='fixed bottom-4 right-4 print:hidden'
                title='Feedback'
                dialogContent={
                    <>
                        <h2 className='text-xl font-bold lg:text-2xl'>
                            Feedback
                        </h2>
                        <p>
                            Report issues or suggestions on{' '}
                            <a
                                href='https://github.com/JosiahFu/math-notes/issues'
                                className='underline'>
                                Github
                            </a>{' '}
                            or{' '}
                            <a
                                href='mailto:josiahfu@gmail.com'
                                className='underline'>
                                email me
                            </a>
                            .
                        </p>
                    </>
                }>
                <FeedbackIcon className='h-4 w-4 cursor-pointer fill-current opacity-80 hover:opacity-100' />
            </DialogButton>
        </main>
    );
}

export default App;
