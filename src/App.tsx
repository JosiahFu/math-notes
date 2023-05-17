import React, { useEffect, useRef, useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import './App.css';
import { DownloadButton, LoadButton, RecoveryButton } from './Saving';
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/dist/rounded.css';

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
    const [recoveryOptions, setRecoveryOptions] = useState(Object.keys(JSON.parse(localStorage.getItem('recovery') ?? '{}')))
    const changes = useRef(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        document.title = title || 'Math Notes'; // If blank
    }, [title]);

    const updateLastSave = () => {
        changes.current = false;
        const recovery = JSON.parse(localStorage.getItem('recovery') ?? '{}');
        if (title in recovery) {
            delete recovery[title];
            localStorage.setItem('recovery', JSON.stringify(recovery));
        }
        console.log(recovery);
    };

    const handleChange = () => {
        changes.current = true;
        const recovery = JSON.parse(localStorage.getItem('recovery') ?? '{}');
        recovery[title] = sections;
        localStorage.setItem('recovery', JSON.stringify(recovery));
    };

    const loadRecovery = (title: string) => {
        const recovery = JSON.parse(localStorage.getItem('recovery') ?? '{}');
        if (title in recovery) {
            setSections(recovery[title]);
            setTitle(title);
            changes.current = true;
        }
    }

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
                <RecoveryButton recoveryOptions={recoveryOptions} loadRecovery={loadRecovery}>
                    <MaterialSymbol icon="history" fill className="button load-button" size={40} grade={100} />
                </RecoveryButton>
            </div>
        </main>
    );
}

export default App;
