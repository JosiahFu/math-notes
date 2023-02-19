import React, { useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import { NestedStateArray } from './Util';
import './App.css';
import { DownloadButton, LoadButton } from './Saving';
import { DownloadIcon, UploadIcon } from './Icons';

// TODO: Section delete button
// TODO: Optional section titles
// TODO: Undoing (Edit History)

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

function App() {
    const sections = new NestedStateArray(useState<MathNoteState[][]>([[new MathNoteState()]]));
    const [title, setTitle] = useState('');

    const setDocumentTitle = (documentTitle: string) => {
        document.title = documentTitle || 'Math Notes'; // If blank
    }

    return (
        <main className="app">
            <Title value={title} setValue={setTitle} placeholder="Untitled Notes" onInput={setDocumentTitle} />
            <Notes sections={sections} />
            <DownloadButton sections={sections.array} title={title || "Untitled Notes"}>
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
