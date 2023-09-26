import { ChangeEventHandler, useCallback, useState } from 'react';

function useDownload(): [string | undefined, (data: string) => void] {
    const [uri, setUri] = useState<string>();

    const setData = (data: string) => {
        if (uri) {
            window.URL.revokeObjectURL(uri);
        }
        setUri(window.URL.createObjectURL(new Blob([data], { type: 'text/plain; encoding=utf8' })))
    }

    return [uri, setData];
}

function useUpload(onRead: (data: string) => void): ChangeEventHandler<HTMLInputElement> {
    return useCallback((event) => {
        const files = (event.target as HTMLInputElement).files;
        if (!files) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            onRead(event.target?.result as string);
        };
        reader.readAsText(files[0]);
    }, [onRead]);
}

export { useDownload, useUpload };
