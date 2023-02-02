import React, { useEffect, useState } from 'react';
import Notes, { MathNoteState } from './Notes';
import { StateArray } from './Util';
import './App.css';

interface TitleProps {
    value: string,
    setValue: (value: string) => void,
    defaultValue: string,
    onInput: (value: string) => void
}
function Title(props: TitleProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setValue(event.target.value);
    };
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        fixTitle();
        props.onInput(event.target.value);
    }
    
    const fixTitle = () => {
        if (props.value === '') {
            props.setValue(props.defaultValue);
        }
    }

    // Title resetting should ONLY run during initial mount or when user unfocuses
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fixTitle, []);

    return (
        <h1>
            <input
                type="text"
                value={props.value} // If blank
                onChange={handleChange}
                onBlur={handleBlur}
                className={props.value === props.defaultValue ? 'untitled' : ''}
            />
        </h1>
    )
}

function App() {
    const lines  = new StateArray(useState<MathNoteState[]>([new MathNoteState()]));
    const [title, setTitle] = useState('');
    
    const setDocumentTitle = (documentTitle: string) => {
        document.title = title || 'Math Notes'; // If blank
    }

    return (
        <main className="app">
            <Title value={title} setValue={setTitle} defaultValue="Untitled Notes" onInput={setDocumentTitle} />
            <Notes lines={lines} />
        </main>
    );

}

export default App;
