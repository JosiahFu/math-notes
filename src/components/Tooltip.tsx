import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import { InfoIcon } from '../icons';

// Left/right prop
function Tooltip({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(true);

    useEffect(() => {
        const handler = () => setClicked(false);
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, []);

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
