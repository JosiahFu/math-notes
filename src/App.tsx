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

function DownloadButton({sections, title}: {sections: MathNoteState[][], title: string}) {
    const [fileContent, setFileContent] = useState('');
    
    const handleClick = () => {
        // setFileContent(
        //     title + '\n' +
        //     '='.repeat(title.length) + '\n' +
        //     sections.map(section => section.map(line => (line.type === FieldType.Text ? '\\"' : '') + line.value + '\n').join('')).join('---\n') + '\n'
        // )
        setFileContent(JSON.stringify({title: title, sections: sections}));
    }

    return <a href={'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent)} onClick={handleClick} download={title + '.json'}>Download</a>
}

function LoadButton({setSections, setTitle}: {setSections: (sections: MathNoteState[][]) => void, setTitle: (title: string) => void}) {
    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const loaded = JSON.parse(event.target!.result as string) as {title: string, sections: MathNoteState[][]};
            setTitle(loaded.title);
            setSections(loaded.sections);
        };
        reader.readAsText((event.target as HTMLInputElement).files![0])
    }
    
    return <input type="file" onInput={handleInput} />
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
            <DownloadButton sections={sections.array} title={title} />
            <LoadButton setSections={sections.setArray} setTitle={setTitle} />
        </main>
    );

}

export default App;
