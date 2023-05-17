import React, { PropsWithChildren, useState } from "react";
import { MathNoteState } from "./Notes";

// V1 {
//     title: string,
//     sections: {value: string, type: FieldType}[][];
// }

// V2 {
//     title: string,
//     sections: {value: string, type: FieldType, isAnswer: boolean}[][],
//     version: 2
// }

interface currentFormat {
    title: string,
    sections: MathNoteState[][],
    // sections: {title: string, lines: MathNoteState[]}[],
    version: 2
}

function dataFixerUpper(jsonInput: any): currentFormat {
    let fixed = structuredClone(jsonInput);

    switch (jsonInput.version) {
        case 2:
            break;
        case 1:
        default:
            fixed.sections.forEach((e: any) => e.isAnswer = false);
    }

    return fixed;
}

function DownloadButton({ sections, title, onClick, children }: PropsWithChildren<{
    sections: MathNoteState[][],
    title: string,
    onClick: (event: React.MouseEvent) => void,
}>) {
    const [fileContent, setFileContent] = useState('');

    const handleClick = (event: React.MouseEvent) => {
        setFileContent(JSON.stringify({ title: title, sections: sections, version: 2 }));
        onClick(event);
    }

    return (<a
        href={'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent)}
        onClick={handleClick}
        download={title.replaceAll(' ', '_') + '.json'}
    >{children}</a>);
}

function LoadButton({ setSections, setTitle, children }: PropsWithChildren<{
    setSections: (sections: MathNoteState[][]) => void,
    setTitle: (title: string) => void,
}>) {
    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const loaded = JSON.parse(event.target!.result as string);
            const loadedState = dataFixerUpper(loaded);
            setTitle(loadedState.title);
            setSections(loadedState.sections);
        };
        reader.readAsText((event.target as HTMLInputElement).files![0])
    }

    return (<label>
        {children}
        <input type="file" onInput={handleInput} style={{ display: 'none' }} />
    </label>);
}

function RecoveryButton({ recoveryOptions, loadRecovery, children }: PropsWithChildren<{
    recoveryOptions: string[],
    loadRecovery: (title: string) => void
}>) {
    const [opened, setOpened] = useState(false);
    return (<div className="recovery-container">
        {recoveryOptions.length > 0 && <label>
            {children}
            <input type="button" style={{ display: 'none' }} onClick={() => setOpened(!opened)} />
        </label>}
        {opened && <div className="recovery-options">
            {recoveryOptions.map((e, i) => <button key={i} className="button recovery-button" onClick={() => { setOpened(false); loadRecovery(e); }}>{e || <em>Untitled</em>}</button>)}
        </div>}
    </div>);
}


export { dataFixerUpper, DownloadButton, LoadButton, RecoveryButton };
