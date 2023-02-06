import React, { useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import { NestedStateArray } from './Util';
import './App.css';

// TODO: Section delete button
// TODO: Optional section titles
// TODO: Save to file
// TODO: Undoing (Edit History)
// TODO: Cross-section keybindings

function Title({value, setValue, placeholder, onInput}: {
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
    )
}

function App() {
    const sections  = new NestedStateArray(useState<MathNoteState[][]>([[new MathNoteState()]]));
    const [title, setTitle] = useState('');
    
    const setDocumentTitle = (documentTitle: string) => {
        document.title = documentTitle || 'Math Notes'; // If blank
    }

    return (
        <main className="app">
            <Title value={title} setValue={setTitle} placeholder="Untitled Notes" onInput={setDocumentTitle} />
            <Notes sections={sections} />
        </main>
    );

}

export default App;
