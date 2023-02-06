import React, { useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import { NestedStateArray } from './Util';
import './App.css';

// TODO: destructuring
// TODO: Cross-section keybindings
// TODO: Undoing
// TODO: Section delete button
// TODO: Optional section titles
// TODO: Save to file

interface TitleProps {
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
    onInput: (value: string) => void
}
function Title(props: TitleProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setValue(event.target.value);
    };
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        props.onInput(event.target.value);
    }

    return (
        <h1>
            <input
                type="text"
                value={props.value}
                placeholder={props.placeholder}
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
