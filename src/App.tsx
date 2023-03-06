import React, { useEffect, useRef, useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import { NestedStateArray } from './Util';
import './App.css';
import { DownloadButton, LoadButton } from './Saving';
import { DownloadIcon, UploadIcon } from './Icons';

// TODO: Confirm before unload
// TODO: Dark Mode
// TODO: *Indenting
// TODO: Section delete button
// TODO: *Optional section titles
// TODO: Duplicate button/key
// TODO: Better recovery
// TODO: *Text then Math box
// * Requires storage format changes

function Title({ value, setValue, placeholder, onInput }: {
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
    onInput: (value: string) => void
}) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onInput(event.target.value);
    }

    return (
        <h1>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </h1>
    );
}

// TODO: Move local storage saving to Saving.tsx somehow?
function App() {
    const sections = new NestedStateArray(useState<MathNoteState[][]>([[new MathNoteState()]]));
    const changes = useRef(false);
    const [title, setTitle] = useState('');

    const setDocumentTitle = (documentTitle: string) => {
        document.title = documentTitle || 'Math Notes'; // If blank
    };

    const updateLastSave = () => {
        changes.current = true;
    };

    const handleChange = () => {
        changes.current = false;
        localStorage.setItem('data', JSON.stringify(sections.array));
    };

    useEffect(() => {
        if (localStorage.getItem('data') === null)
            return;
        sections.setArray(JSON.parse(localStorage.getItem('data')!) as MathNoteState[][]);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUnload = (event: BeforeUnloadEvent) => {
        if (changes.current) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        window.onbeforeunload = handleUnload;
    }, []);

    return (
        <main className="app">
            <Title value={title} setValue={setTitle} placeholder="Untitled Notes" onInput={setDocumentTitle} />
            <Notes sections={sections} onChange={handleChange} />
            <DownloadButton sections={sections.array} title={title || "Untitled Notes"} onClick={updateLastSave}>
                {/* <img src={downloadIcon} alt="Download" className="download-button" /> */}
                <DownloadIcon className="button load-button" />
            </DownloadButton>
            <LoadButton setSections={sections.setArray} setTitle={setTitle}>
                <UploadIcon className="button load-button" />
            </LoadButton>
        </main>
    );
}

export default App;
