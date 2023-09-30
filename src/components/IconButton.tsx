import { FunctionComponent, HTMLAttributes, SVGProps } from 'react';
import Button from './Button';

function IconButton({
    icon: Icon,
    ...otherProps
}: HTMLAttributes<HTMLDivElement> & {
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}) {
    return (
        <Button {...otherProps}>
            <Icon className='h-8 w-8 fill-gray-800 dark:fill-gray-200 lg:h-10 lg:w-10' />
        </Button>
    );
}

export default IconButton;
