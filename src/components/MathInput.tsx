import { useCallback, useEffect, useRef } from 'react';
import { ControlledComponentProps, NavigationHandlers } from '../data';
import '../fixGlobal';
import {
    Direction,
    EditableMathField,
    MathField,
    MathFieldConfig,
    addStyles,
} from 'react-mathquill';

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
    onDownOut,
    onLeftOut,
    onRightOut,
    onUpOut,
    onInsertAfter,
    onDelete,
}: ControlledComponentProps<string> & Partial<NavigationHandlers>) {
    const mathFieldRef = useRef<MathField>();

    const handleChange = useCallback(
        (mathfield: MathField) => {
            onChange(mathfield.latex());
        },
        [onChange]
    );

    // Update mathquill config
    useEffect(() => {
        mathFieldRef.current?.config({
            ...mathquillConfigOptions,
            handlers: {
                downOutOf: onDownOut,
                upOutOf: onUpOut,
                moveOutOf: direction => {
                    (direction === Direction.R ? onRightOut : onLeftOut)?.();
                },
                edit: handleChange,
                enter: onInsertAfter,
                deleteOutOf: onDelete,
            },
        });
    }, [
        handleChange,
        onDelete,
        onDownOut,
        onInsertAfter,
        onLeftOut,
        onRightOut,
        onUpOut,
    ]);

    const handleMount = useCallback((mathfield: MathField) => {
        mathFieldRef.current = mathfield;
    }, []);

    return (
        <EditableMathField
            mathquillDidMount={handleMount}
            latex={value}
            onChange={handleChange}
            config={mathquillConfigOptions}
        />
    );
}

export default MathInput;
