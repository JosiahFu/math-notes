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
    const [hovered, setHovered] = useState(false);
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
        <div className={`inline-block print:hidden ${className}`}>
            <div className='relative'>
                <InfoIcon
                    className='h-4 w-4 cursor-pointer fill-current hover:brightness-110'
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClicked}
                />

                {(hovered || clicked) && (
                    <div className='absolute right-full -mt-[50%] mr-3 w-max -translate-y-1/2 rounded-md bg-black/60 p-2 text-sm text-white'>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tooltip;
