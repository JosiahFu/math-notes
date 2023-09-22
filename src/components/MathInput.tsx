import { useCallback, useEffect, useRef } from 'react';
import {
    ControlledComponentProps,
    MQDir,
    NavigationHandlers,
    FocusProps,
} from '../data';
import '../fixGlobal';
import {
    EditableMathField,
    addStyles,
    MathField,
    MathFieldConfig,
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
    focused,
    focusSide,
    onDownOut,
    onLeftOut,
    onRightOut,
    onUpOut,
    onInsertAfter,
    onDelete,
}: ControlledComponentProps<string> &
    Partial<NavigationHandlers> &
    FocusProps) {
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
                        (direction === MQDir.right
                            ? onRightOut
                            : onLeftOut)?.();
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

        // Handle focusing
        useEffect(() => {
            if (focused) {
                mathFieldRef.current?.focus();
                if (focusSide === 'left') mathFieldRef.current?.moveToLeftEnd();
                if (focusSide === 'right')
                    mathFieldRef.current?.moveToRightEnd();
            }
        }, [focusSide, focused]);

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
