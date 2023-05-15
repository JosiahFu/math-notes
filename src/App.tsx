import React, { useEffect, useRef, useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import './App.css';
import { DownloadButton, LoadButton } from './Saving';
import { DownloadIcon, UploadIcon } from './Icons';

// TODO: Search and Replace
// TODO: Confirm before unload
// TODO: Dark Mode
// TODO: *Indenting
// TODO: Section delete button
// TODO: *Optional section titles
// TODO: Duplicate button/key
// TODO: Multiple Recovery, store title
// TODO: Clear button
// TODO: *Text then Math box
// TODO: *Math Tables
// TODO: Fix arrow key navigation
// * Requires storage format changes

function Title({ value, setValue, placeholder }: {
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
}) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <h1>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
            />
        </h1>
    );
}

// TODO: Move local storage saving to Saving.tsx somehow?
function App() {
    const [sections, setSections] = useState<MathNoteState[][]>([[new MathNoteState()]]);
    const changes = useRef(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        document.title = title || 'Math Notes'; // If blank
    }, [title]);

    const updateLastSave = () => {
        changes.current = false;
    };

    const handleChange = () => {
        changes.current = true;
        localStorage.setItem('data', JSON.stringify(sections));
    };

    useEffect(() => {
        if (localStorage.getItem('data') === null)
            return;
        setSections(JSON.parse(localStorage.getItem('data')!) as MathNoteState[][]);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const preventUnload = (event: BeforeUnloadEvent) => event.preventDefault();

    useEffect(() => {
        if (changes.current) {
            window.addEventListener('beforeunload', preventUnload);
            return () => window.removeEventListener('beforeunload', preventUnload);
        }
    }, [changes]);

    return (
        <main className="app">
            <Title value={title} setValue={setTitle} placeholder="Untitled Notes" />
            <Notes sections={sections} setSections={setSections} onChange={handleChange} />
            <DownloadButton sections={sections} title={title || "Untitled Notes"} onClick={updateLastSave}>
                {/* <img src={downloadIcon} alt="Download" className="download-button" /> */}
                <DownloadIcon className="button load-button" />
            </DownloadButton>
            <LoadButton setSections={setSections} setTitle={setTitle}>
                <UploadIcon className="button load-button" />
            </LoadButton>
        </main>
    );
}

export default App;
