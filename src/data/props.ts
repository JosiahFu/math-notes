import { Direction } from './notes';

interface ControlledComponentProps<T> {
    value: T;
    onChange: (value: T) => void;
}
interface NavigationProps {
    focused: boolean;
    focusSide: Direction | undefined;
    onFocus: () => void;
    onUpOut?: () => void;
    onDownOut?: () => void;
    onLeftOut?: () => void;
    onRightOut?: () => void;
    onInsertAfter?: () => void;
    onDeleteOut?: () => void;
}

export type { ControlledComponentProps, NavigationProps };
