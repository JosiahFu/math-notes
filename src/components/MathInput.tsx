import { useEffect, useRef } from 'react';
import { ControlledComponentProps, MQDir, NavigationProps } from '../data';
import '../fixGlobal'; // Must be called before react-mathquill
import {
    EditableMathField,
    addStyles,
    MathField,
    MathFieldConfig,
} from 'react-mathquill';
import '../mq_styles';
import './mathquill.css';

addStyles();

const mathquillConfigOptions: MathFieldConfig = {
    spaceBehavesLikeTab: true,
    autoCommands:
        'sqrt pi tau theta langle rangle union intersection and or infinity int sum prod',
    autoOperatorNames:
        'log ln exp sin cos tan sec csc cot arcsin arccos arctan arcsec arccsc arccot sinh cosh tanh sech csch coth arcsinh arccosh arctanh arcsech arccsch arccoth',
    autoSubscriptNumerals: true,
};

function MathInput({
    value,
    onChange,
    focused,
    focusSide,
    onFocus,
    onDownOut,
    onLeftOut,
    onRightOut,
    onUpOut,
    onInsertAfter,
    onDelete,
}: ControlledComponentProps<string> & NavigationProps) {
    const mathFieldRef = useRef<MathField>();

    const supressEditEvent = useRef(2);

    // Update mathquill config
    useEffect(() => {
        mathFieldRef.current?.config({
            ...mathquillConfigOptions,
            handlers: {
                downOutOf: onDownOut,
                upOutOf: onUpOut,
                moveOutOf: direction => {
                    (direction === MQDir.right ? onRightOut : onLeftOut)?.();
                },
                edit: (mathfield: MathField) => {
                    if (supressEditEvent.current > 0) {
                        supressEditEvent.current--;
                    } else {
                        console.log('EDIT');
                        onChange(mathfield.latex());
                    }
                },
                enter: onInsertAfter,
                deleteOutOf: () => {
                    supressEditEvent.current = 1;
                    onDelete?.();
                },
            },
        });
    }, [
        onChange,
        onDelete,
        onDownOut,
        onInsertAfter,
        onLeftOut,
        onRightOut,
        onUpOut,
    ]);

    const handleMount = (mathfield: MathField) => {
        mathFieldRef.current = mathfield;
    };

    // Handle focusing
    useEffect(() => {
        if (focused) {
            mathFieldRef.current?.focus();
            if (focusSide === 'left') mathFieldRef.current?.moveToLeftEnd();
            if (focusSide === 'right') mathFieldRef.current?.moveToRightEnd();
        }
    }, [focusSide, focused]);

    return (
        <EditableMathField
            mathquillDidMount={handleMount}
            latex={value}
            config={mathquillConfigOptions}
            onFocus={onFocus}
        />
    );
}

export default MathInput;
