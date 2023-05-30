import React, { useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import { classList as cl } from '../Util';
import { addStyles, MathField, EditableMathField, MathFieldConfig } from 'react-mathquill'
import { MaterialSymbol } from 'react-material-symbols';
import { OnChange } from './Notes';
addStyles();

enum FieldType {
    Math = 'MATH',
    Text = 'TEXT'
}

class MathNoteState {
    value: string;
    type: FieldType;
    isAnswer: boolean;

    constructor(value = '', type = FieldType.Math, isAnswer = false) {
        this.value = value;
        this.type = type;
        this.isAnswer = isAnswer;
    };
}

const config: MathFieldConfig = {
    spaceBehavesLikeTab: true,
    autoCommands: 'sqrt pi tau theta langle rangle in union intersection and or'
}

function MathNoteField({ state: { value, type, isAnswer }, setState, focused, onFocus, keyboardHandlers }: {
    state: MathNoteState,
    setState: (state: MathNoteState) => void,
    focused: boolean,
    onFocus: (event?: React.FocusEvent) => void,
    keyboardHandlers: {
        up: () => void,
        down: () => void,
        add: () => void,
        delete: () => void
    }
}) {
    const textInput = useRef<HTMLInputElement>(null);
    const mathField = useRef<MathField>();
    const saveHistory = useContext(OnChange);

    const focus = () => {
        if (focused)
            (type === FieldType.Math ? mathField : textInput).current?.focus();
    };

    useEffect(focus, [focused, type]);

    const handleMathFieldChange = useCallback((target: MathField) => {
        if (target === undefined) return; // With handlers target may be undefined for a frame

        if (target.latex() === '"') {
            setState(new MathNoteState('', FieldType.Text, isAnswer));
        } else {
            setState(new MathNoteState(target.latex(), type, isAnswer));
        }
    }, [isAnswer, setState, type]);

    const handleTextNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(new MathNoteState(event.target.value, type, isAnswer));
    }

    const handleFocus = (event: React.FocusEvent) => {
        if (event.isTrusted) {
            onFocus(event);
        }
    }

    const toggleAnswer = () => {
        setState(new MathNoteState(value, type, !isAnswer));
        onFocus();
    };

    const handleTextNoteKeyPress = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                keyboardHandlers.up();
                break;
            case 'ArrowDown':
                keyboardHandlers.down();
                break;
            case 'Backspace':
                if (value !== '') return;
                keyboardHandlers.delete();
                break;
            case 'Enter':
                keyboardHandlers.add();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'm':
                if (!event.ctrlKey) return;
                toggleAnswer();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    const configWithHandlers: MathFieldConfig = useMemo(() => ({
        ...config,
        handlers: {
            downOutOf: keyboardHandlers.down,
            upOutOf: keyboardHandlers.up,
            deleteOutOf: keyboardHandlers.delete,
            enter: keyboardHandlers.add,
            edit: handleMathFieldChange
        }
    }), [keyboardHandlers, handleMathFieldChange]);

    useEffect(() => {
        mathField.current?.config(configWithHandlers)
    }, [configWithHandlers]);

    return (
        <div className={cl('note-field', isAnswer && 'answer')} onKeyDown={handleKeyPress}>
            {type === FieldType.Math ?
                <EditableMathField
                    latex={value}
                    config={configWithHandlers}
                    onChange={handleMathFieldChange}
                    onFocus={handleFocus}
                    onBlur={saveHistory!}
                    mathquillDidMount={target => mathField.current = target}
                /> :
                <input
                    className="text-note"
                    onChange={handleTextNoteChange}
                    onKeyDown={handleTextNoteKeyPress}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={saveHistory!}
                    ref={textInput}
                />}
            <button className="button answer-button" onClick={toggleAnswer}>
                <MaterialSymbol icon="star" fill size={20} grade={100} />
            </button>
        </div>
    );
}

export default MathNoteField;
export { MathNoteState };
export type { FieldType };
