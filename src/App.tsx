import React, { useEffect, useRef, useState } from 'react';
import Notes from './notes/Notes';
import { MathNoteState } from './notes/MathNoteField';
import './App.css';
import { DownloadButton, LoadButton, RecoveryButton, deleteRecovery, setRecovery } from './Saving';
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/dist/rounded.css';

// TODO: Confirm before unload
// TODO: Duplicate button/key
// TODO: Link Embed
// TODO: Search and Replace
// TODO: *Optional section titles
// TODO: *Indenting
// TODO: Section delete button
// TODO: *Text then Math box
// TODO: *Math Tables
// TODO: Clear button
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
        deleteRecovery(title)
    };

    const handleChange = () => {
        changes.current = true;
        setRecovery(title, sections);
    };

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
            <div className="control-buttons">
                <DownloadButton sections={sections} title={title || "Untitled Notes"} onClick={updateLastSave}>
                    <MaterialSymbol icon="download" fill className="button load-button" size={40} grade={100} />
                </DownloadButton>
                <LoadButton setSections={setSections} setTitle={setTitle}>
                    <MaterialSymbol icon="upload" fill className="button load-button" size={40} grade={100} />
                </LoadButton>
                <RecoveryButton onLoadRecovery={(title, sections) => { setTitle(title); setSections(sections); }}>
                    <MaterialSymbol icon="history" fill className="button load-button" size={40} grade={100} />
                </RecoveryButton>
            </div>
        </main>
    );
}

export default App;
