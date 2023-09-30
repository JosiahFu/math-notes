import { ReactNode, useState } from 'react';
import { InfoIcon } from '../icons';

// Left/right prop
function Tooltip({ children }: { children: ReactNode }) {
    const [shown, setShown] = useState(true);

    return (
        <div className='fixed right-4 top-4 inline-block print:hidden'>
            <div className='relative'>
                <InfoIcon
                    className='h-4 w-4 cursor-pointer fill-current hover:brightness-110'
                    onMouseEnter={() => setShown(true)}
                    onMouseLeave={() => setShown(false)}
                />

                {shown && (
                    <div className='absolute -top-1/2 right-full mr-4 w-max rounded-md bg-black/60 p-2 text-sm text-white'>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tooltip;
