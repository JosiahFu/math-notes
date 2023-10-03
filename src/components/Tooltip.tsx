import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import { InfoIcon } from '../icons';
import { useLocalStorage } from '@tater-archives/react-use-localstorage';

function Tooltip({
    className,
    children,
    localStorageKey,
}: {
    className?: string;
    children: ReactNode;
    localStorageKey: string;
}) {
    const [showHint, setShowHint] = useLocalStorage(true, localStorageKey);
    const [clicked, setClicked] = useState(showHint);

    useEffect(() => {
        const handler = () => {
            if (showHint) setShowHint(false);
            setClicked(false);
        };
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, [setClicked, setShowHint, showHint]);

    const handleClicked: MouseEventHandler = event => {
        setClicked(true);
        event.stopPropagation();
    };

    return (
        <div className={`group inline-block print:hidden ${className}`}>
            <div className='relative'>
                <InfoIcon
                    className='h-4 w-4 cursor-pointer fill-current hover:brightness-110'
                    onClick={handleClicked}
                />

                <div
                    className={`absolute right-full -mt-[50%] mr-3 w-max max-w-lg -translate-y-4 rounded-md bg-black/60 p-2 text-sm text-white ${
                        clicked ? 'block' : 'hidden group-hover:block'
                    }`}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Tooltip;
