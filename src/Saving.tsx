import React, { PropsWithChildren, useState } from "react";
import { MathNoteState } from "./Notes";
import { MaterialSymbol } from "react-material-symbols";

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

function getRecovery(): Record<string, MathNoteState[][]> {
    return JSON.parse(localStorage.getItem('recovery') ?? '{}');
}

function setRecovery(title: string, sections: MathNoteState[][]) {
    const recovery = getRecovery();
    recovery[title] = sections;
    localStorage.setItem('recovery', JSON.stringify(recovery));
}

function deleteRecovery(title: string) {
    const recovery = getRecovery();
    if (title in recovery) {
        delete recovery[title];
        localStorage.setItem('recovery', JSON.stringify(recovery));
    }
}

function clearRecovery() {
    localStorage.removeItem('recovery');
}

function RecoveryButton({ onLoadRecovery, children }: PropsWithChildren<{
    onLoadRecovery: (title: string, sections: MathNoteState[][]) => void
}>) {
    const [opened, setOpened] = useState(false);
    const [recoveryState, setRecoveryState] = useState<Record<string, MathNoteState[][]>>(getRecovery());

    const updateRecovery = () => setRecoveryState(getRecovery());

    const handleClear = () => {
        setOpened(false);
        clearRecovery();
        updateRecovery();
    }

    const handleOpen = () => {
        if (!opened)
            updateRecovery();
        setOpened(!opened);
    }

    return (<div className="recovery-container">
        {Object.keys(recoveryState).length > 0 && <label>
            {children}
            <input type="button" style={{ display: 'none' }} onClick={handleOpen} />
        </label>}
        {opened && <div className="recovery-options">
            <button className="button" onClick={handleClear}>
                <MaterialSymbol icon="delete_forever" fill size={20} grade={100} />
            </button>
            {Object.entries(recoveryState).map(([title, sections], i) => (
                <button key={i} className="button recovery-button" onClick={() => {
                    setOpened(false);
                    onLoadRecovery(title, sections as MathNoteState[][]);
                }}>
                    {title || <em>Untitled</em>}
                </button>
            ))}
        </div>}
    </div>);
}


export { dataFixerUpper, DownloadButton, LoadButton, RecoveryButton, getRecovery as getRecoveryOptions, setRecovery, deleteRecovery, clearRecovery };
